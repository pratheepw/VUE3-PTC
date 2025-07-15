<script setup lang="ts">
    import { AgGridVue } from 'ag-grid-vue3'
    import {ColDef,GridApi,GridReadyEvent,IDatasource,IGetRowsParams,RowModelType,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import LoadingGif from '@/assets/images/spinner.gif'
    import VIconRenderer from '@/components/ag-grid/VIconRenderer.vue'
    import VChipRenderer from '@/components/ag-grid/VChipRenderer.vue'
    import YarnCheckDetailRenderer from '@/views/yarn-check/yarn-check-detail-renderer.vue'
    import DropDownFloatingFilter from '@/components/ag-grid/DropDownFloatingFilter.vue'

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'
    import { useDisplay } from 'vuetify'


    definePage({
        meta:{
            action:'read',
            subject:'yarn-check'
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
    myStore.currentPageTitle='Yarn Stock / Check In-Out-Return'

    const dateRange=ref('')
    const status=ref('All')
    const loadings=ref<boolean[]>([])
    watch([dateRange,status],async([newDateRange,newStatus],[oldDateRange,oldStatus])=>{
        if (newDateRange !== oldDateRange || newStatus !== oldStatus) {
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
            headerName:'',
            cellRenderer:'YarnCheckDetailRenderer',
            cellClass:'d-flex align-center justify-center',
        },
        {
            headerName:'Status',field:'status',
            cellRenderer:'VChipRenderer',
            cellRendererParams:{
                values:[
                    {color:'success',text:'In',value:'In'},
                    {color:'warning',text:'Return',value:'Return'},
                    {color:'error',text:'Out',value:'Out'}
                ]
            },
            cellClass:'d-flex align-center',
        },
        {
            headerName:'ID',field:'yarnId',type:'rightAligned',maxWidth:87,
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'equals' },
            suppressFloatingFilterButton:true,
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
                { 'text': 'Sample', 'value': true }, 
                { 'text': 'Order', 'value': false }]
            },
            suppressFloatingFilterButton:true,   
        },
        {
            field:'code',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,
            suppressFloatingFilterButton:true,    
        },
        {
            headerName:'From',field:'recFrom',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,
            suppressFloatingFilterButton:true,  
        },
        {
            field:'carton',type:'rightAligned',
             valueFormatter:(params:any)=>{
                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
             }
        },
        {
            field:'weight',type:'rightAligned',
             valueFormatter:(params:any)=>{
                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
             }
        },
        {
            field:'weightLbs',type:'rightAligned',
             valueFormatter:(params:any)=>{
                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
             }
        },
        {
            headerName:'Doc No.',field:'docNo',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,
            suppressFloatingFilterButton:true,  
        },
        {
            headerName:'PO NO.',field:'poNo',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,
            suppressFloatingFilterButton:true,  
        },
        {
            headerName:'Delivery No.',field:'deliveryNo',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,
            suppressFloatingFilterButton:true,  
        },
        {
            headerName:'Lot No.',field:'lotNo',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,
            suppressFloatingFilterButton:true,  
        },
        
        {
            headerName:'Doc Date',field:'docDate',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):''
                }
            },
            filter:'agDateColumnFilter',
            floatingFilter:true,
            suppressFloatingFilterButton:true, 
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
                    const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/yarn/getyarncheckpartial?dateSearch=${dateRange.value}&status=${status.value}&request=${JSON.stringify(request)}&exportExcel=false`)
                    if(footer){
                        rowFooter.value=[{
                            totalRows:footer.totalRows,
                            carton : footer.carton,
                            weight : footer.weight,
                            weightLbs:footer.weightLbs
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
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/yarn/getyarncheckpartial?dateSearch=${dateRange.value}&status=${status}&request=${JSON.stringify(request)}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','YarnCheck.xlsx')
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

    // 👉 Export Excel 2
    const exportExcel2=async()=>{
        try {
            loadings.value[2]=true
            const request={startRow:0,endRow:0,filterModel:gridApi.value?.getFilterModel(),sortModel:null}
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/yarn/getyarncheckexcel2?dateSearch=${dateRange.value}&status=${status}&request=${JSON.stringify(request)}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','YarnCheckExcel2.xlsx')
            document.body.appendChild(link)
            link.click()
            link.remove()

            setTimeout(()=>{
                window.URL.revokeObjectURL(url)
            },100)
            loadings.value[2]=false
        } catch (error) {
            loadings.value[2]=false
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
                pcs : 0,
                weight : 0,
                piece : 0,
                length : 0,
                rPcs : 0,
                rWeight : 0,
                rPiece : 0,
                rLength : 0,
                sPcs : 0,
                sWeight : 0,
                sPiece : 0,
                sLength : 0
            }]
    }

    defineExpose({
        VIconRenderer,
        VChipRenderer,
        YarnCheckDetailRenderer,
        DropDownFloatingFilter
    })
</script>
<template>
    <VCard>
        <VCardText class="px-1 py-1">
            <VRow no-gutters>
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
                <VCol cols="6" sm="4" md="2" xl="1" class="pa-1">
                    <VSelect
                        v-model="status"
                        :items="['All','In','Out','Return']"
                        label="Status"
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
                        class="ms-1"
                        :loading="loadings[1]"
                        :disabled="loadings[1]"
                        @click="exportExcel()"
                    >
                        <VIcon start icon="tabler-file-excel"/>    
                        Export Excel
                    </VBtn>
                    <VBtn
                        size="small"
                        color="success"
                        class="ms-1"
                        variant="tonal"
                        :loading="loadings[2]"
                        :disabled="loadings[2]"
                        @click="exportExcel2()"
                    >
                        <VIcon start icon="tabler-file-excel"/>    
                        Excel 2
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

