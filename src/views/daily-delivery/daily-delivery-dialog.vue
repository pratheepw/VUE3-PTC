<script setup lang="ts">
    import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
    import { AgGridVue } from 'ag-grid-vue3';
    import {ColDef,GridApi,GridReadyEvent,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    
    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'

    const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
    const props=defineProps({
        sysDate:String,
        fabricCode:String,
        lotNo:String,
        color:String,
        fabOrderNo:String,
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
            headerName:'In time',field:'time',maxWidth:143,
            cellDataType:'date',
            cellRenderer:(params:any)=>{
                return params.value?params.value.substr(0,16).replace('T',' '):null
            }
        },
        {headerName:'Code',field:'fabricCode'},
        {headerName:'Piece No.',field:'pieceNo'},
        {headerName:'Dyeing Machine',field:'machineNo',wrapHeaderText:true,maxWidth:90},
        {headerName:'Lot No.',field:'lotNo'},
        {headerName:'Order No.',field:'orderNo'},
        {headerName:'Color',field:'color'},
        {
            field:'weight',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            field:'piece',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            field:'length',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {field:'lengthUnit',wrapHeaderText:true,maxWidth:77},
        {field:'section'},
        {
            field:'defect',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            field:'price',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {field:'type'}

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
        const {data,footer}=await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getdailydeliverymodal?dateSearch=${props.sysDate}&fabricCode=${props.fabricCode}&lotNo=${props.lotNo}&color=${props.color}&fabOrderNo=${props.fabOrderNo}&exportExcel=false`)
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
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getdailydeliverymodal?dateSearch=${props.sysDate}&fabricCode=${props.fabricCode}&lotNo=${props.lotNo}&color=${props.color}&fabOrderNo=${props.fabOrderNo}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','dailydeliverymodal.xlsx')
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
                        Detail of Daily Delivery Report
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
                    :headerHeight="38"
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
