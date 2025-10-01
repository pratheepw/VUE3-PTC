<script setup lang="ts">
    import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
    import { AgGridVue } from 'ag-grid-vue3';
    import {ColDef,GridApi,GridReadyEvent,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import LoadingGif from '@/assets/images/spinner.gif'

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'

    const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
    const props=defineProps({
        invoiceNo:String,
        mark:String,
    })

    // 👉 Set agGrid theme
    const myStore = useMyStore()
    const configStore=useConfigStore()
    watch(()=>configStore.theme,(newValue,oldValue)=>{
        const userPreferredColorScheme = usePreferredColorScheme()
        const userTheme=userPreferredColorScheme.value==='dark'?'ag-theme-quartz-dark':'ag-theme-quartz'
        myStore.agGridthemeClass=configStore.theme==='system'?userTheme:configStore.theme==='dark'? 'ag-theme-quartz-dark':'ag-theme-quartz'
    })

    const rowDataDetail=ref<any[]>([])
    const rowDataTotal=ref<any[]>([])
    const rowDataExport=ref<any[]>([])
    const currentTab=ref('Detail')
    const loadings=ref<boolean[]>([])

    // 👉 agGrid
    const gridApiDetail=shallowRef<GridApi|null>(null)
    const gridApiTotal=shallowRef<GridApi|null>(null)
    const gridApiExport=shallowRef<GridApi|null>(null)

    const rowFooterDetail=ref<any>()
    const rowFooterTotal=ref<any>()
    const rowFooterExport=ref<any>()

    const columnDefsDetail=ref([
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
        {headerName:'Carton No.',field:'cartonNo'},
        {headerName:'CTNS',field:'cartons',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'Quantity',field:'quantity',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'Model No.',field:'modelNo'},
        {headerName:'Size',field:'mSize',cellClass:'text-center'},
        {headerName:'Color',field:'mColor'},
        {headerName:'Price',field:'price',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'G.W.',field:'gTotal',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'N.W.',field:'nTotal',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'CMS.',field:'cms'},

    ])
    const columnDefsTotal=ref([
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
        {
            headerName:'PACKS',field:'pack',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'PCS',field:'pcs',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'CTNS',field:'cartons',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'G.W.',field:'gw',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'N.W.',field:'nw',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'CBM',field:'cbm',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
    ])
    const columnDefsExport=ref([
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
        {headerName:'Export Entry No.', field:'exportEntry'},
        {
            headerName:'Date',field:'exportDate',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):null
                }
            },
        },
        {headerName:'Invoice No.',field:'invoiceNo'},
        {
            headerName:'Invoice Date',field:'invoiceDate',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):null
                }
            },
        },
        {
            headerName:'Receive Blue Conner',field:'receiveDate',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):null
                }
            },
        },
        {
            headerName:'Spend Time (Day)',field:'spendTime',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'Submit BOI for Cut Stock',field:'submitDate',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):null
                }
            },
        },
        {
            headerName:'Approve Cut Stock',field:'approveDate',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):null
                }
            },
        },
        {
            headerName:'Spend Time (Day)',field:'spendTime2',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
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

    const onGridReadyDetail=async (params:GridReadyEvent)=>{
        gridApiDetail.value=params.api
        const {data,footer}=await $api<any>(`${import.meta.env.BASE_URL}api/exim/GetExportInvoiceModal?invoiceNo=${props.invoiceNo}&mark=${props.mark}&exportExcel=false`)
        rowDataDetail.value=data
        rowFooterDetail.value=[{
            totalRows:footer.totalRows,
            cartons:footer.cartons,
            quantity:footer.quantity,
            gTotal:footer.gTotal,
            nTotal:footer.nTotal,
        }]
        gridApiDetail.value?.autoSizeAllColumns()
    }
    const onGridReadyTotal=async (params:GridReadyEvent)=>{
        gridApiTotal.value=params.api
        const {data,footer}=await $api<any>(`${import.meta.env.BASE_URL}api/exim/GetExportInvoiceModalTotal?invoiceNo=${props.invoiceNo}&mark=${props.mark}`)
        rowDataTotal.value=data
        rowFooterTotal.value=[{
            totalRows:footer.totalRows,
        }]
        gridApiTotal.value?.autoSizeAllColumns()
    }
    const onGridReadyExport=async (params:GridReadyEvent)=>{
        gridApiExport.value=params.api
        const {data,footer}=await $api<any>(`${import.meta.env.BASE_URL}api/exim/GetExportInvoiceModalExport?invoiceNo=${props.invoiceNo}&mark=${props.mark}`)
        rowDataExport.value=data
        rowFooterExport.value=[{
            totalRows:footer.totalRows,
        }]
        gridApiExport.value?.autoSizeAllColumns()
    }

    const exportExcel=async()=>{
        try {
            loadings.value[0]=true
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/exim/GetExportInvoiceModal?invoiceNo=${props.invoiceNo}&mark=${props.mark}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','ExportInvoiceDetail.xlsx')
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

    })
</script>
<template>
    <v-dialog
        :width="$vuetify.display.smAndDown ? 'auto' : '80%'"
        v-model="isDialogVisible"
    >
        <DialogCloseBtn @click="isDialogVisible=false"/>
        <VCard height="80vh">
            <VCardTitle primary-title>
                <VRow>
                    <VCol cols="12">{{props.invoiceNo}}</VCol>
                </VRow>
            </VCardTitle>
            <VTabs v-model="currentTab">
                <VTab>Detail</VTab>
                <VTab>Total</VTab>
                <VTab>Export Entry</VTab>
            </VTabs>
            <VCardText class="pa-1">
                <VWindow v-model="currentTab">
                    <VWindowItem value="Detail">
                        <div class="ag-wrapper">
                           <ag-grid-vue
                                id="inGrid"
                                @gridReady="onGridReadyDetail"
                                :autoSizeStrategy="autoSizeStrategy"
                                :class=myStore.agGridthemeClass
                                :columnDefs="columnDefsDetail"
                                :defaultColDef="defaultColDef"
                                :getRowStyle="getRowStyle"
                                :headerHeight="40"
                                :rowData="rowDataDetail"
                                :row-height="35"
                                :pinnedBottomRowData="rowFooterDetail"
                                :suppressColumnVirtualisation="true"
                                style="width: 100%;height: 100%;"
                            /> 
                            
                        </div>
                    </VWindowItem>
                    <VWindowItem value="Total">
                        <div class="ag-wrapper">
                            <ag-grid-vue
                                id="returnGrid"
                                @gridReady="onGridReadyTotal"
                                :autoSizeStrategy="autoSizeStrategy"
                                :class=myStore.agGridthemeClass
                                :columnDefs="columnDefsTotal"
                                :defaultColDef="defaultColDef"
                                :getRowStyle="getRowStyle"
                                :headerHeight="40"
                                :rowData="rowDataTotal"
                                :row-height="35"
                                :pinnedBottomRowData="rowFooterTotal"
                                :suppressColumnVirtualisation="true"
                                style="width: 100%;height: 100%;"
                            />
                        </div>
                        
                    </VWindowItem>
                    <VWindowItem value="Export">
                        <div class="ag-wrapper">
                            <ag-grid-vue
                                id="outGrid"
                                @gridReady="onGridReadyExport"
                                :autoSizeStrategy="autoSizeStrategy"
                                :class=myStore.agGridthemeClass
                                :columnDefs="columnDefsExport"
                                :defaultColDef="defaultColDef"
                                :getRowStyle="getRowStyle"
                                :headerHeight="40"
                                :rowData="rowDataExport"
                                :row-height="35"
                                :pinnedBottomRowData="rowFooterExport"
                                :suppressColumnVirtualisation="true"
                                style="width: 100%;height: 100%;"
                            />
                        </div>
                    </VWindowItem>
                </VWindow>
            </VCardText>
            <VCardActions class="pa-1">
                <VBtn
                    size="small"
                    color="success"
                    class="me-auto"
                    variant="outlined"
                    :loading="loadings[0]"
                    :disabled="loadings[0]"
                    @click="exportExcel()"
                >
                    <VIcon start icon="tabler-file-excel" size="22"/>
                    Export Excel
                </VBtn>
            </VCardActions>
        </VCard>
    </v-dialog>
</template>
<style scoped>
    .v-window,.v-window-item,.ag-wrapper {
        height: 100%;
    }
</style>
