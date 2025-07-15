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
        yarnId:Number,
        code:String,
        supplier:String,
        lotNo:String,
        section:String,
        sample:Boolean,
        status:String,
        dateSearch:String,
        location:String,
        customer:String
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
        { field:'serial'},
        {
            headerName:'Carton No.',field:'cartonNo',type:'rightAligned',
        },
        {
            field:'weight',type:'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            field:'sample',
            cellRenderer:'VIconRenderer',
            cellRendererParams:{
                values:[
                    {color:'secondary',icon:'tabler-check',value:true},
                ]
            },
            cellClass:'d-flex align-center justify-center',
        },
        {headerName:'PO No.',field:'poNo'},
        {
            headerName:'PO Date',field:'poDate',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):null
                }
            },

        },
        {
            headerName:'Register',field:'register',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short',timeStyle:'short' }).format(d):null
                }
            },

        }









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
        let urlApi=props.dateSearch?`${import.meta.env.BASE_URL}api/yarn/GetYarnBalanceModal?yarnId=${props.yarnId}&supplier=${props.supplier}&lotNo=${props.lotNo}&section=${props.section}&sample=${props.sample}&location=${props.location}&customer=${props.customer}&status=${props.status}&dateSearch=${props.dateSearch}&exportExcel=false`:
            `${import.meta.env.BASE_URL}api/yarn/GetYarnBalanceCurrentModal?yarnId=${props.yarnId}&supplier=${props.supplier}&lotNo=${props.lotNo}&section=${props.section}&sample=${props.sample}&location=${props.location}&customer=${props.customer}&exportExcel=false`
        const {data,footer}=await $api<any>(urlApi)
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
            let urlApi=props.dateSearch?`${import.meta.env.BASE_URL}api/yarn/GetYarnBalanceModal?yarnId=${props.yarnId}&supplier=${props.supplier}&lotNo=${props.lotNo}&section=${props.section}&sample=${props.sample}&location=${props.location}&customer=${props.customer}&status=${props.status}&dateSearch=${props.dateSearch}&exportExcel=true`:
            `${import.meta.env.BASE_URL}api/yarn/GetYarnBalanceCurrentModal?yarnId=${props.yarnId}&supplier=${props.supplier}&lotNo=${props.lotNo}&section=${props.section}&sample=${props.sample}&location=${props.location}&customer=${props.customer}&exportExcel=true`
            const res = await $api<any>(urlApi)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','YarnBalanceDetail.xlsx')
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
        VIconRenderer,
    })
</script>
<template>
    <v-dialog
        :width="$vuetify.display.smAndDown ? 'auto' : '80%'"
        v-model="isDialogVisible"
    >
        <DialogCloseBtn @click="isDialogVisible=false"/>
        <v-card height="80vh">
            <v-card-title primary-title>
                <VRow>
                    <VCol cols="12">
                        {{props.code}}
                    </VCol>
                </VRow>
            </v-card-title>
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
