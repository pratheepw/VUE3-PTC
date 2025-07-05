<script setup lang="ts">
    import { AgGridVue } from 'ag-grid-vue3'
    import {ColDef,GridApi,GridReadyEvent,IDatasource,IGetRowsParams,RowModelType,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import LoadingGif from '@/assets/images/spinner.gif'

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'
    import { useDisplay } from 'vuetify'

    definePage({
        meta:{
            action:'read',
            subject:'gf-search-fabric'
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
    myStore.currentPageTitle='Greige Fabric Stock / Search Grey Fabric by Fabric'

    const dateRange=ref('')
    const status=ref('All')
    const items=[
        {title:'All',value:'All'},
        {title:'In Stock',value:'In'},
        {title:'Out Stock',value:'Out'}
    ]
    const loadings=ref<boolean[]>([])
    watch([status,dateRange],async([newStatus,oldStatus],[newDateRange,oldDateRange])=>{
        if (newStatus!==oldStatus || newDateRange!==oldDateRange) {
            clearGrid()
        }
    })
    
    // 👉 agGrid
    const gridApi=shallowRef<GridApi|null>(null)
    const rowData=ref([])
    const rowFooter=ref<any>()

    const columnDefs=ref([
        {
            headerName: '#',
            maxWidth: 60,pinned: 'left',
            valueGetter: 'node.rowIndex',
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
            headerName: 'Customer', field: 'customer',
            filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName: 'Order No.', field: 'fabOrderNo',
            filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName: 'Code', field: 'code',
            filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName: 'Lot No.', field: 'lotNo',
            filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName: 'Piece No.', field: 'pieceNo',
            filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName: 'M/C', field: 'machineNo',
            filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true,
        },
        {
            headerName: 'Weight', field: 'weight', type: 'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName: 'Issue', field: 'issue',
            filter: 'agTextColumnFilter', floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true,
        },
        { 
            headerName: 'InTimeDate', field: 'inTimeDate', 
            cellDataType: 'date',
            valueFormatter:(params:any)=>{
                const d=new Date(params.value)
                return (isNaN(d)) ? '' : new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    hourCycle: 'h23',
                }).format(d)

            }
        },
        { 
            headerName: 'OutTimeDate', field: 'outTimeDate',
            cellDataType: 'date',
            valueFormatter:(params:any)=>{
                const d=new Date(params.value)
                return (isNaN(d)) ? '' : new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                    hourCycle: 'h23',
                }).format(d)

            }
        },
        {
            headerName: 'Yarn LotNo', field: 'yarnLotNo',
            wrapText:true,autoHeight:true,
            cellClass:'text-small',
            cellRenderer:(params:any)=>{
                return params.value?params.value.toString().replaceAll(',','<br/>'):null
            }
        },
        {
            headerName: 'Yarn Name', field: 'yarnName', 
            wrapText: true, autoHeight: true,
            cellClass: 'text-small',
            cellRenderer:(params:any)=>{
                return params.value?params.value.toString().replaceAll(',','<br/>'):null
            }
        },
        
    ])
    const defaultColDef = ref<ColDef>({
      sortable: false,
      resizable:true,
      suppressHeaderMenuButton:true,
      width:100,
    })
    // const rowBuffer = ref(0);
    // const rowModelType = ref<RowModelType>("infinite");
    // const cacheBlockSize = ref(100);
    // const cacheOverflowSize = ref(2);
    // const maxConcurrentDatasourceRequests = ref(1);
    // const infiniteInitialRowCount = ref(1000);
    // const maxBlocksInCache = ref(10);
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

    // 👉 grid events
    const onGridReady=async (params:GridReadyEvent)=>{
        gridApi.value=params.api
        gridApi.value?.setGridOption('domLayout','normal')
        document.getElementById('grid1')!.style.height=gridHeight.value+'px'
    }
    const onFilterChanged=(event:any)=>{
        let totalRows=0
        let weight=0
        const api=event.api
        api.forEachNodeAfterFilter((node:any)=>{
            if(!node.rowPinned){
                totalRows+=1
                weight+=node.data.weight?node.data.weight:0
            }
        })
        rowFooter.value=[{
            totalRows:totalRows,
            pieceNo:totalRows,
            weight:weight
        }]
    }

    // 👉 Fetching data
    const fetchData=async()=>{
        try {
            loadings.value[0]=true
            const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/GetGFSearchFabricPartial?status=${status.value}&dateSearch=${dateRange.value}&exportExcel=false`)
            rowData.value=data
            if(footer){
                rowFooter.value=[{
                    totalRows:footer.totalRows,
                    pieceNo:footer.pieceNo,
                    weight : footer.weight,
                }]
            }
            gridApi.value?.autoSizeAllColumns()
            loadings.value[0]=false
        } catch (error) {
            loadings.value[0]=false
            console.log(error)
        }
    }

    // 👉 Export CSV
    const exportCSV=async()=>{
        try {
            loadings.value[1]=true
            gridApi.value?.exportDataAsCsv({
                fileName: `GFSearchFabric.csv`,
                columnKeys: ['customer','fabOrderNo','code','lotNo','pieceNo','machineNo','weight','issue','inTimeDate','outTimeDate','yarnLotNo','yarnName'],
            })
            loadings.value[1]=false
        } catch (error) {
            loadings.value[1]=false
            console.log(error)
        }
        
    }

    // 👉 Clear grid
    const clearGrid=()=>{
        rowData.value=[]
        rowFooter.value=undefined
    }

</script>
<template>
    <VCard>
        <VCardText class="px-1 py-1">
            <VRow no-gutters>
                <VCol cols="6" sm="4" md="2" xl="1" class="pa-1">
                    <VSelect
                        v-model="status"
                        :items=items
                        item-title="title"
                        item-value="value"
                        label="Status"
                    />
                </VCol>
                <VCol cols="2" sm="auto" class="pa-3">
                    <label class="v-label text-body-2 text-high-emphasis">Date</label>
                </VCol>
                <VCol cols="10" sm="6" md="4" lg="3" xl="2"  class="pa-1">
                    <AppDateTimePicker
                        v-model="dateRange"
                        placeholder="Select date range"
                        :config="{mode:'range'}"
                    />
                </VCol>
                
                <VCol cols="6" sm="12" md="auto" class="pa-1 d-flex flex-column flex-md-row">
                    <VBtn
                        class="ms-1"
                        :loading="loadings[0]"
                        :disabled="loadings[0]"
                        @click="fetchData()"
                    >
                        <VIcon start icon="tabler-search"/>    
                        Search
                    </VBtn>
                </VCol>
                <VCol cols="12" class="py-1">
                    <ag-grid-vue
                        id="grid1"
                        @filterChanged="onFilterChanged"
                        @gridReady="onGridReady"
                        :autoSizeStrategy="autoSizeStrategy"
                        :class=myStore.agGridthemeClass
                        :columnDefs="columnDefs"
                        :defaultColDef="defaultColDef"
                        :getRowStyle="getRowStyle"
                        :headerHeight="38"
                        :row-height="35"
                        :rowData="rowData"
                        :pinnedBottomRowData="rowFooter"
                        :suppressColumnVirtualisation="true"
                    />
                </VCol>
                <VCol cols="auto" class="pa-1">
                    <VBtn
                        size="small"
                        color="success"
                        class="ms-1"
                        :loading="loadings[1]"
                        :disabled="loadings[1]"
                        @click="exportCSV()"
                    >
                        <VIcon start icon="tabler-file-type-csv"/>    
                        Export CSV
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

