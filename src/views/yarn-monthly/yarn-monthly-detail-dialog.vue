<script setup lang="ts">
    import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
    import { AgGridVue } from 'ag-grid-vue3';
    import {ColDef,GridApi,GridReadyEvent,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import LoadingGif from '@/assets/images/spinner.gif'
    import VIconRenderer from '@/components/ag-grid/VIconRenderer.vue';

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'

    const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
    const props=defineProps({
        searchType:String,
        documentNo:String,
        yarnId:Number,
        lotNo:String,
    })

    // 👉 Set agGrid theme
    const myStore = useMyStore()
    const configStore=useConfigStore()
    watch(()=>configStore.theme,(newValue,oldValue)=>{
        const userPreferredColorScheme = usePreferredColorScheme()
        const userTheme=userPreferredColorScheme.value==='dark'?'ag-theme-quartz-dark':'ag-theme-quartz'
        myStore.agGridthemeClass=configStore.theme==='system'?userTheme:configStore.theme==='dark'? 'ag-theme-quartz-dark':'ag-theme-quartz'
    })

    const rowData=ref<any[]>([])
    const loadings=ref<boolean[]>([])

    // 👉 agGrid
    const gridApi=shallowRef<GridApi|null>(null)
    const rowFooter=ref<any>()

    const columnDefs=ref([
        {
            headerName: '#',
            maxWidth: 60,pinned: 'left',
            valueGetter: 'node.id',
            cellRenderer: (params:any) => {
                if (params.node.rowPinned)
                    return ''
                else if (params.value !== undefined)
                    return parseInt(params.value) + 1
                else
                    return '<img src='+LoadingGif+' width="35" height="35"/>'
            },
        },
        {headerName:'Serial', field:'serial'},
        {headerName:'Weight', field:'weight', type:'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'Price', field:'price', type:'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'Lot No.', field:'lotNo'},
        {headerName:'Sample', field:'sample',
            cellRenderer:'VIconRenderer',
            cellRendererParams:{
                values:[
                    {color:'secondary',icon:'tabler-check',value:true},
                ]
            },
            cellClass:'d-flex align-center justify-center',
        },
        {headerName:'Location', field:'location'},

    ])
    const defaultColDef = ref<ColDef>({
      sortable: false,
      resizable:true,
      suppressHeaderMenuButton:true,
      width:100,
    })
    const autoSizeStrategy = ref<
      | SizeColumnsToFitGridStrategy
      | SizeColumnsToFitProvidedWidthStrategy
      | SizeColumnsToContentStrategy
    >({
      type: "fitCellContents",
    })
    const getRowStyle=(params:any) => {
        if (params.node.rowPinned == "bottom") {
            return { 'font-weight': 'bold' };
        }
    }

    const onGridReady=async (params:GridReadyEvent)=>{
        gridApi.value=params.api
        const {data,footer}=await $api<any>(`${import.meta.env.BASE_URL}api/yarn/GetYarnMonthlyDetailModal?searchType=${props.searchType}&documentNo=${props.documentNo}&yarnId=${props.yarnId}&lotNo=${props.lotNo}&exportExcel=false`)
        rowData.value=data
        rowFooter.value=[{
            totalRows:footer.totalRows,
            weight:footer.weight,
        }]
        gridApi.value?.autoSizeAllColumns()
    }
    
    const exportExcel=async()=>{
        try {
            loadings.value[0]=true
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/yarn/GetYarnMonthlyDetailModal?searchType=${props.searchType}&documentNo=${props.documentNo}&yarnId=${props.yarnId}&lotNo=${props.lotNo}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','YarnMonthlyDetailModal.xlsx')
            document.body.appendChild(link)
            link.click()
            link.remove()

            setTimeout(()=>{
                window.URL.revokeObjectURL(url)
            },100)
            loadings.value[0]=false
        } catch (error) {
            loadings.value[0]=false
            console.log(error)
        }
    }

    defineExpose({
        VIconRenderer
    })
</script>
<template>
    <v-dialog
        :width="$vuetify.display.smAndDown ? 'auto' : '80%'"
        v-model="isDialogVisible"
    >
        <DialogCloseBtn @click="isDialogVisible=false"/>
        <v-card height="80vh">
            <VCardText class="pa-1">
                <ag-grid-vue
                    id="myGrid"
                    @gridReady="onGridReady"
                    :autoSizeStrategy="autoSizeStrategy"
                    :class=myStore.agGridthemeClass
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :getRowStyle="getRowStyle"
                    :headerHeight="40"
                    :rowData="rowData"
                    :row-height="35"
                    :pinnedBottomRowData="rowFooter"
                    :suppressColumnVirtualisation="true"
                    style="width: 100%;height: 100%;"
                />
            </VCardText>
            <VCardActions>
                <VBtn
                    size="small"
                    color="success"
                    class="me-auto"
                    variant="outlined"
                    :loading="loadings[0]"
                    :disabled="loadings[0]"
                    @click="exportExcel()"
                >
                    <VIcon start icon="tabler-file-excel"/>
                    Export Excel
                </VBtn>
                <VChip
                    v-if="rowFooter"
                    color="#E91E63"
                >
                    {{ new Intl.NumberFormat().format(rowFooter[0].totalRows) }} rows
                </VChip>
                <VChip
                    v-else
                    color="#E91E63">
                    0 rows
                </VChip>
            </VCardActions>
        </v-card>
    </v-dialog>
</template>
