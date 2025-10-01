<script setup lang="ts">
    import LoadingGif from '@/assets/images/spinner.gif'
    import DropDownFloatingFilter from '@/components/ag-grid/DropDownFloatingFilter.vue'
    import VIconRenderer from '@/components/ag-grid/VIconRenderer.vue'
    import exportInvoiceBy from '@/views/export-invoice/export-invoice-by.vue'
    import { ColDef, GridApi, GridReadyEvent, IDatasource, IGetRowsParams, RowModelType, SizeColumnsToContentStrategy, SizeColumnsToFitGridStrategy, SizeColumnsToFitProvidedWidthStrategy } from 'ag-grid-community'
    import { AgGridVue } from 'ag-grid-vue3'

    import { useMyStore } from '@/stores/my'
    import { useConfigStore } from '@core/stores/config'
    import { useDisplay } from 'vuetify'
import ExportInvoiceInvoicenoRenderer from '@/views/export-invoice/export-invoice-invoiceno-renderer.vue'


    definePage({
        meta:{
            action:'read',
            subject:'export-invoice'
        }
    })

    // 👉 Get window size
    const {width,height}=useWindowSize()
    const {name}=useDisplay()
    const gridHeight=computed(()=>{
        let headerHeight=0
        switch(name.value){
            case 'xs': 
                headerHeight= 315
                break
            case 'sm': 
                headerHeight= 275
                break
            case 'md': 
                headerHeight= 200
                break
            case 'lg': 
                headerHeight= 200
                break
            case 'xl': 
                headerHeight= 200
                break
            case 'xxl': 
                headerHeight= 200
                break
        }
        return height.value-headerHeight
    })

    // 👉 Set agGrid theme
    const myStore = useMyStore()
    const configStore=useConfigStore()
    watch(()=>configStore.theme,(newValue,oldValue)=>{
        const userPreferredColorScheme = usePreferredColorScheme()
        const userTheme=userPreferredColorScheme.value==='dark'?'ag-theme-quartz-dark':'ag-theme-quartz'
        myStore.agGridthemeClass=configStore.theme==='system'?userTheme:configStore.theme==='dark'? 'ag-theme-quartz-dark':'ag-theme-quartz'
    })

    // 👉 Set current page title
    myStore.currentPageTitle='Exim / Export Invoice'

    const searchBy=ref('loadDate')
    const now=new Date()
    const thisDay=now.toISOString().substring(0,10)
    const textSearch=ref(thisDay)
    const loadings=ref<boolean[]>([])

    watch([textSearch,searchBy],async([newTextSearch,newSearchBy],[oldTextSearch,oldSearchBy])=>{
        if (newTextSearch !== oldTextSearch || newSearchBy !== oldSearchBy) {
            clearGrid()
        }
    })
    
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
        {
            headerName:'Loading Date',field:'loadDate',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):''
                }
            },
            filter:'agDateColumnFilter',
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Invoice No.',field:'invoiceNo',
            cellRenderer:'ExportInvoiceInvoicenoRenderer',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true,    
        },
        {
            headerName:'Description',field:'invoiceDescription',
            cellClass:'text-small',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true,    
        },
        {
            headerName:'Customer',field:'customer',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true,    
        },
        {
            headerName:'Sold To',field:'soldTo',
            cellClass:'text-small',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true,    
        },
        {
            headerName:'By',field:'transportType',
            cellRenderer:'VIconRenderer',
            cellRendererParams:{
                values:[
                    {color:'info',icon:'tabler-ship',value:'SHIP'},
                    {color:'success',icon:'tabler-truck',value:'TRUCK'},
                    {color:'error',icon:'tabler-plane',value:'AIR'},
                    {color:'secondary',icon:'tabler-question-mark',value:''}
                ]
            },
            cellClass:'text-center',
            filter:'agTextColumnFilter',
            filterParams:{
                filterOptions: ["equals"],
                maxNumConditions: 1
            },
            floatingFilter:true,
            floatingFilterComponent:'DropDownFloatingFilter',
            floatingFilterComponentParams:{
                values: [
                    { 'text': 'All', 'value': '' }, 
                    { 'text': 'Air', 'value': 'AIR' }, 
                    { 'text': 'Ship', 'value': 'SHIP' },
                    { 'text': 'Truck', 'value': 'TRUCK' }
                ]
            },
            suppressFloatingFilterButton:true,     
        },
        {
            headerName:'By Name',field:'transportBy',
            cellClass:'text-small'
        },
        {
            headerName:'L/C No.',field:'lcName',
            cellClass:'text-small',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true,    
        },
        {
            headerName:'Export No.',field:'exportEntry',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true, suppressFloatingFilterButton:true,    
        },
        {
            headerName:'Qty(Pcs)',field:'quantity',type:'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'Amount',field:'amount',type:'rightAligned',
             valueFormatter:(params:any)=>{
                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
             }
        },
        {
            headerName:'Currency',field:'currency',cellClass:'text-center',
  
        },
        {
            headerName:'Rate',field:'rate',type:'rightAligned',
             valueFormatter:(params:any)=>{
                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
             }
        },
        {
            headerName:'Amount(฿)',field:'thaiAmount',type:'rightAligned',
             valueFormatter:(params:any)=>{
                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
             }
        },
        {
            headerName:'Discount(%)',field:'discount',type:'rightAligned',
             valueFormatter:(params:any)=>{
                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
             }
        },
        {
            headerName:'Type',field:'mark',
            filter:'agTextColumnFilter',
            filterParams:{
                filterOptions: ["equals"],
                maxNumConditions: 1
            },
            floatingFilter:true,
            floatingFilterComponent:'DropDownFloatingFilter',
            floatingFilterComponentParams:{
                values: [
                    { 'text': 'All', 'value': '' }, 
                    { 'text': 'T.U.W.', 'value': 'T.U.W.' }, 
                    { 'text': 'JOCKEY', 'value': 'JOCKEY' }
                ]
            },
            suppressFloatingFilterButton:true,   
        },
        {
            headerName:'Dept.',field:'departmentId',
            filter:'agTextColumnFilter',
            filterParams:{
                filterOptions: ["equals"],
                maxNumConditions: 1
            },
            floatingFilter:true,
            floatingFilterComponent:'DropDownFloatingFilter',
            floatingFilterComponentParams:{
                values: [
                    { 'text': 'All', 'value': '' }, 
                    { 'text': 'SALES1', 'value': 'SALES1' }, 
                    { 'text': 'SALES2', 'value': 'SALES2' },
                    { 'text': 'SALES5', 'value': 'SALES5' }
                ]
            },
            suppressFloatingFilterButton:true,   
        },
        {
            headerName:'Cut Stock',field:'cutStock',
            cellRenderer:'VIconRenderer',
            cellRendererParams:{
                values:[
                    {color:'secondary',icon:'tabler-check',value:true},
                ]
            },
            cellClass:'d-flex align-center justify-center',
            filter:'agTextColumnFilter',
            filterParams:{
                filterOptions: ["equals"],
                maxNumConditions: 1
            },
            floatingFilter:true,
            floatingFilterComponent:'DropDownFloatingFilter',
            floatingFilterComponentParams:{
                values: [
                    { 'text': 'All', 'value': '' }, 
                    { 'text': 'Yes', 'value': true }, 
                    { 'text': 'No', 'value': false }
                ]
            },
            suppressFloatingFilterButton:true,   
        },
        {
            headerName:'ETD',field:'etd',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):''
                }
            },
            filter:'agDateColumnFilter',
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'ETA',field:'eta',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):''
                }
            },
            filter:'agDateColumnFilter',
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'User name',field:'userName',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true,    
        },
    ])
    const defaultColDef = ref<ColDef>({
      sortable: false,
      resizable:true,
      suppressHeaderMenuButton:true,
      width:100,
    })
    const rowBuffer = ref(0);
    const rowModelType = ref<RowModelType>("infinite");
    const cacheBlockSize = ref(100);
    const cacheOverflowSize = ref(2);
    const maxConcurrentDatasourceRequests = ref(1);
    const infiniteInitialRowCount = ref(1000);
    const maxBlocksInCache = ref(10);
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
        gridApi.value?.setGridOption('domLayout','normal')
        document.getElementById('grid1')!.style.height=gridHeight.value+'px'
    }

    // 👉 Fetching data
    const fetchData=async()=>{
        const dataSource:IDatasource={
            rowCount:undefined,
            getRows:async(params:IGetRowsParams)=>{
                try {
                    loadings.value[0]=true
                    const request={startRow:params.startRow,endRow:params.endRow,filterModel:params.filterModel,sortModel:params.sortModel}
                    const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/exim/GetExportInvoicePartial?searchBy=${searchBy.value}&txtSearch=${textSearch.value}&request=${JSON.stringify(request)}&exportExcel=false`)
                    if(footer){
                        rowFooter.value=[{
                            totalRows:footer.totalRows,
                            quantity : footer.quantity,
                            amount : footer.amount,
                            thaiAmount:footer.thaiAmount
                        }]
                    }
                    
                    const totalCount=(footer)?footer.totalRows:0
                    const lastRow=params.endRow>=totalCount?totalCount:-1    
                    params.successCallback(data,lastRow)
                    gridApi.value?.autoSizeAllColumns()
                    loadings.value[0]=false
                } catch (error) {
                    loadings.value[0]=false
                    console.log(error)
                    params.failCallback()
                }
            }
        }
        gridApi.value?.setGridOption('datasource',dataSource)
    }

    // 👉 Export Excel
    const exportExcel=async()=>{
        try {
            loadings.value[1]=true
            const request={startRow:0,endRow:0,filterModel:gridApi.value?.getFilterModel(),sortModel:null}
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/exim/GetExportInvoicePartial?searchBy=${searchBy.value}&txtSearch=${textSearch.value}&request=${JSON.stringify(request)}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','ExportInvoice.xlsx')
            document.body.appendChild(link)
            link.click()
            link.remove()

            setTimeout(()=>{
                window.URL.revokeObjectURL(url)
            },100)
            loadings.value[1]=false
        } catch (error) {
            loadings.value[1]=false
            console.log(error)
        }
        
    }

    // 👉 Clear grid
    const clearGrid=()=>{
        const emptyDatasource:IDatasource={
                getRows:async(params:IGetRowsParams)=>{
                    params.successCallback([],0)
                }
            }
            gridApi.value?.setGridOption('datasource',emptyDatasource)
            rowFooter.value=[{
                totalRows:0,
                quantity : 0,
                amount : 0,
                thaiAmount : 0
            }]
    }

    defineExpose({
        ExportInvoiceInvoicenoRenderer,
        DropDownFloatingFilter,
        VIconRenderer
    })
</script>
<template>
    <VCard>
        <VCardText class="px-1 py-1">
            <VRow no-gutters>
                <VCol cols="6" sm="4" md="2" xl="1" class="pa-1">
                    <VSelect
                        v-model="searchBy"
                        :items="['loadDate','invoiceNo','exportEntry']"
                        label="Search by"
                    />
                </VCol>
                <VCol cols="10" sm="6" md="4" lg="3" xl="2"  class="pa-1">
                    <AppDateTimePicker
                        v-if="searchBy==='loadDate'"
                        v-model="textSearch"
                        placeholder="Select date range"
                        :config="{mode:'range'}"
                    />
                    <VTextField
                        v-else
                        v-model="textSearch"
                    />
                </VCol>
                
                <VCol cols="6" sm="12" md="auto" class="pa-1 d-flex flex-column flex-md-row">
                    <VBtn
                        class="ms-1"
                        :loading="loadings[0]"
                        :disabled="loadings[0]"
                        @click="fetchData()"
                    >
                        <VIcon start icon="tabler-search" size="22"/>    
                        Search
                    </VBtn>
                </VCol>
                <VCol cols="12" class="py-1">
                    <ag-grid-vue
                        id="grid1"
                        @gridReady="onGridReady"
                        :autoSizeStrategy="autoSizeStrategy"
                        :class=myStore.agGridthemeClass
                        :columnDefs="columnDefs"
                        :defaultColDef="defaultColDef"
                        :getRowStyle="getRowStyle"
                        :headerHeight="38"
                        :row-height="35"
                        :pinnedBottomRowData="rowFooter"
                        :suppressColumnVirtualisation="true"
                        
                        :rowBuffer="rowBuffer"
                        :rowModelType="rowModelType"
                        :cacheBlockSize="cacheBlockSize"
                        :cacheOverflowSize="cacheOverflowSize"
                        :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
                        :infiniteInitialRowCount="infiniteInitialRowCount"
                        :maxBlocksInCache="maxBlocksInCache"
                    />
                </VCol>
                <VCol cols="auto" class="pa-1">
                    <VBtn
                        size="small"
                        color="success"
                        :loading="loadings[1]"
                        :disabled="loadings[1]"
                        @click="exportExcel()"
                    >
                        <VIcon start icon="tabler-file-excel" size="22"/>    
                        Export Excel
                    </VBtn>
                </VCol>
                <VCol 
                    cols="auto" class="pa-1 d-flex justify-end ms-auto "
                >
                    <VChip 
                        v-if=" rowFooter"
                        color="#E91E63"
                    >
                        {{ new Intl.NumberFormat().format(rowFooter[0].totalRows)}} rows
                    </VChip>
                    <VChip
                        v-else
                        color="#E91E63">
                        0 rows
                    </VChip>
                </VCol>
            </VRow>
        </VCardText>

    </VCard>
</template>

