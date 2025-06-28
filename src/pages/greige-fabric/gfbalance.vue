<script setup lang="ts">
    import { AgGridVue } from 'ag-grid-vue3'
    import {ColDef,GridApi,GridReadyEvent,IDatasource,IGetRowsParams,RowModelType,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import DropDownFloatingFilter from '@/components/ag-grid/DropDownFloatingFilter.vue'
    import gfbalanceCodeRenderer from '@/views/gfbalance/gfbalance-code-renderer.vue'
    import LoadingGif from '@/assets/images/spinner.gif'

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'
    import { useDisplay } from 'vuetify'

    definePage({
        meta:{
            action:'read',
            subject:'gfbalance'
        }
    })

    // 👉 Get window size
    const {width,height}=useWindowSize()
    const {name}=useDisplay()
    const gridHeight=computed(()=>{
        let headerHeight=0
        switch(name.value){
            case 'xs': 
                headerHeight= 300
                break
            case 'sm': 
                headerHeight= 160
                break
            case 'md': 
                headerHeight= 160
                break
            case 'lg': 
                headerHeight= 160
                break
            case 'xl': 
                headerHeight= 160
                break
            case 'xxl': 
                headerHeight= 160
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
    myStore.currentPageTitle='Greige Fabric Stock / Balance'

    const currentTab=ref('Summary')
    const loadings=ref<boolean[]>([])

    // 👉 agGrid
    const gridApi=shallowRef<GridApi|null>(null)
    const gridApi2=shallowRef<GridApi|null>(null)
    const rowFooter=ref<any>()
    const rowFooter2=ref<any>()

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
            headerName:'Code',field:'code',
            cellRenderer:'gfbalanceCodeRenderer',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Qty',field:'qty',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'Weight',field:'weight',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'Amount',field:'amount',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'11',field:'knitHole',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName: "Section", field: "section", 
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
                    {'text':'FABRIC','value':'FABRIC'},
                    {'text':'SALES1','value':'SALES1'},
                    {'text':'SALES2','value':'SALES2'},
                    {'text':'SALES4','value':'SALES4'},
                    {'text':'SALES5','value':'SALES5'},
                    {'text':'THAI PARFUN','value':'THAI PARFUN'}
                ],
            
            },
            suppressFloatingFilterButton:true,
        }

    ])
    const columnDefs2=ref([
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
            field:'prodDate',maxWidth:143,
            cellDataType:'date',
            cellRenderer:(params:any)=>{
                return params.value?params.value.substr(0,16).replace('T',' '):null
            }
        },
        {
            headerName:'Code',field:'code',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            field:'pieceNo',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Weight',field:'weight',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            field:'baht',type:'rightAligned',
            cellRenderer:(params:any)=>{
                if(params.node.rowPinned=='bottom')
                    return ''
                else
                    return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName: "Section", field: "section", 
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
                    {'text':'FABRIC','value':'FABRIC'},
                    {'text':'SALES1','value':'SALES1'},
                    {'text':'SALES2','value':'SALES2'},
                    {'text':'SALES4','value':'SALES4'},
                    {'text':'SALES5','value':'SALES5'},
                    {'text':'THAI PARFUN','value':'THAI PARFUN'}
                ],
            
            },
            suppressFloatingFilterButton:true,
        },
        {field:'grade',cellClass:'text-center'},
        {
            headerName:'Employee',field:'empId',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName:'1',field:'knitCircle',type:'rightAligned',headerTooltip:'รูกลม (Round Hole)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'2',field:'knitOval',type:'rightAligned',headerTooltip:'รูรี (Oval Hole)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'3',field:'knitBrokeNeedle',type:'rightAligned',headerTooltip:'เข็มหัก (Broken Needle)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'4',field:'knitHook',type:'rightAligned',headerTooltip:'รอยเกี่ยวผ้า (Scratch)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'5',field:'knitBad',type:'rightAligned',headerTooltip:'รอยฟันหนู (Fabric Stain)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'6',field:'dust',type:'rightAligned',headerTooltip:'ฝุ่น (Dust)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'7',field:'knitDirtyMachine',type:'rightAligned',headerTooltip:'รอยสปันขาด (Dirty Machine)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'8',field:'knitDirty',type:'rightAligned',headerTooltip:'เปื้อน (Dirty)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'9',field:'knitHorizontal',type:'rightAligned',headerTooltip:'เป็นเม็ดกับ เศษด้ายปน',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'10',field:'knitConnectEnd',type:'rightAligned',headerTooltip:'ต่อปลาย (Ending Joint)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'11',field:'knitHole',type:'rightAligned',headerTooltip:'ตามด (Knit Hole)',
            //headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'Knit Factory',field:'factory',
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
    const onGridReady2=async (params:GridReadyEvent)=>{
        gridApi2.value=params.api
        gridApi2.value?.setGridOption('domLayout','normal')
        document.getElementById('grid2')!.style.height=gridHeight.value+'px'
    }

    // 👉 Fetching data -- Summary
    const fetchData=async()=>{
        loadings.value[0]=true
        const dataSource:IDatasource={
            rowCount:undefined,
            getRows:async(params:IGetRowsParams)=>{
                try {
                    const request={startRow:params.startRow,endRow:params.endRow,filterModel:params.filterModel,sortModel:params.sortModel}
                    const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfbalance?currentTab=${currentTab.value}&request=${JSON.stringify(request)}&exportExcel=false`)
                    rowFooter.value=[{
                            totalRows:footer.totalRows,
                            qty:footer.qty,
                            weight:footer.weight,
                            amount:footer.amount,
                            knitHole:footer.knitHole,
                        }]

                    const totalCount=(footer)?footer.totalRows:0
                    const lastRow=params.endRow>=totalCount?totalCount:-1    
                    params.successCallback(data,lastRow)
                    gridApi.value?.autoSizeAllColumns()
                } catch (error) {
                    loadings.value[0]=false
                    console.log(error)
                    params.failCallback()
                }
            }
        }
        gridApi.value?.setGridOption('datasource',dataSource)
        loadings.value[0]=false
    }
    // 👉 Fetching data -- Detail
    const fetchData2=async()=>{
        loadings.value[2]=true
        currentTab.value='Detail'
        const dataSource:IDatasource={
            rowCount:undefined,
            getRows:async(params:IGetRowsParams)=>{
                try {
                    const request={startRow:params.startRow,endRow:params.endRow,filterModel:params.filterModel,sortModel:params.sortModel}
                    const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfbalance?currentTab=${currentTab.value}&request=${JSON.stringify(request)}&exportExcel=false`)
                    rowFooter2.value=[{
                        totalRows:footer.totalRows,
                        weight:footer.weight,
                        knitCircle:footer.knitCircle,
                        knitOval:footer.knitOval,
                        knitBrokeNeedle:footer.knitBrokeNeedle,
                        knitHook:footer.knitHook,
                        knitBad:footer.knitBad,
                        dust:footer.dust,
                        knitDirtyMachine:footer.knitDirtyMachine,
                        knitDirty:footer.knitDirty,
                        knitHorizontal:footer.knitHorizontal,
                        knitConnectEnd:footer.knitConnectEnd,
                        knitHole:footer.knitHole
                    }]

                    const totalCount=(footer)?footer.totalRows:0
                    const lastRow=params.endRow>=totalCount?totalCount:-1    
                    params.successCallback(data,lastRow)
                    gridApi2.value?.autoSizeAllColumns()
                } catch (error) {
                    loadings.value[2]=false
                    console.log(error)
                    params.failCallback()
                }
            }
        }
        gridApi2.value?.setGridOption('datasource',dataSource)
        loadings.value[2]=false
    }

    // 👉 Export Excel -- Summary
    const exportExcel=async()=>{
        try {
            loadings.value[1]=true
            const request={startRow:0,endRow:0,filterModel:gridApi.value?.getFilterModel(),sortModel:null}
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfbalance?currentTab=${currentTab.value}&request=${JSON.stringify(request)}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','gfbalance.xlsx')
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
    // 👉 Export Excel -- Detail
     const exportExcel2=async()=>{
        currentTab.value='Detail'
        try {
            loadings.value[3]=true
            const request={startRow:0,endRow:0,filterModel:gridApi.value?.getFilterModel(),sortModel:null}
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfbalance?currentTab=${currentTab.value}&request=${JSON.stringify(request)}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','gfbalance_detail.xlsx')
            document.body.appendChild(link)
            link.click()
            link.remove()

            setTimeout(()=>{
                window.URL.revokeObjectURL(url)
            },100)
            loadings.value[3]=false
        } catch (error) {
            loadings.value[3]=false
            console.log(error)
        }
        
    }

    defineExpose({
        DropDownFloatingFilter,
        gfbalanceCodeRenderer
    })
</script>
<template>
    <VCard>
        <div class="d-flex">
            <div>
                <VTabs
                    v-model="currentTab"
                    direction="vertical"
                >
                 <VTab value="Summary" text="Summary"></VTab>
                <VTab value="Detail" text="Detail"></VTab>
                </VTabs>
            </div>
            <VCardText class="px-1 pt-1 pb-0">
                <VWindow
                    v-model="currentTab"
                    class="ms-3"
                >
                    <VWindowItem value="Summary">
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
                        <VRow class="my-1">
                            <VCol cols="12" sm="8" class="py-1">
                                <VBtn
                                    size="small"    
                                    color="primary"
                                    :loading="loadings[0]"
                                    :disabled="loadings[0]"
                                    @click="fetchData()"
                                >
                                    <VIcon start icon="tabler-refresh"/>
                                    Refresh
                                </VBtn>
                                <VBtn
                                    size="small"
                                    color="success"
                                    class="ms-1"
                                    variant="tonal"
                                    :loading="loadings[1]"
                                    :disabled="loadings[1]"
                                    @click="exportExcel()"
                                >
                                    <VIcon start icon="tabler-file-excel"/>    
                                Export Excel
                                </VBtn>
                            </VCol>
                            <VCol 
                                cols="6" sm="4"
                                class="d-flex justify-end ms-auto py-1"
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
                    </VWindowItem>
                    <VWindowItem value="Detail">
                        <ag-grid-vue
                            id="grid2"
                            @gridReady="onGridReady2"
                            :autoSizeStrategy="autoSizeStrategy"
                            :class=myStore.agGridthemeClass
                            :columnDefs="columnDefs2"
                            :defaultColDef="defaultColDef"
                            :getRowStyle="getRowStyle"
                            :headerHeight="38"
                            :row-height="35"
                            :pinnedBottomRowData="rowFooter2"
                            :suppressColumnVirtualisation="true"
                            :rowBuffer="rowBuffer"
                            :rowModelType="rowModelType"
                            :cacheBlockSize="cacheBlockSize"
                            :cacheOverflowSize="cacheOverflowSize"
                            :maxConcurrentDatasourceRequests="maxConcurrentDatasourceRequests"
                            :infiniteInitialRowCount="infiniteInitialRowCount"
                            :maxBlocksInCache="maxBlocksInCache"
                        />
                        <VRow class="my-1">
                            <VCol cols="12" sm="8" class="py-1">
                                <VBtn
                                    size="small"    
                                    color="primary"
                                    :loading="loadings[2]"
                                    :disabled="loadings[2]"
                                    @click="fetchData2()"
                                >
                                    <VIcon start icon="tabler-refresh"/>
                                    Refresh
                                </VBtn>
                                <VBtn
                                    size="small"
                                    color="success"
                                    class="ms-1"
                                    variant="tonal"
                                    :loading="loadings[3]"
                                    :disabled="loadings[3]"
                                    @click="exportExcel2()"
                                >
                                    <VIcon start icon="tabler-file-excel"/>    
                                Export Excel
                                </VBtn>
                            </VCol>
                            <VCol 
                                cols="6" sm="4"
                                class="d-flex justify-end ms-auto py-1"
                            >
                                <VChip 
                                    v-if=" rowFooter2"
                                    color="#E91E63"
                                >
                                    {{ new Intl.NumberFormat().format(rowFooter2[0].totalRows)}} rows
                                </VChip>
                                <VChip
                                    v-else
                                    color="#E91E63">
                                    0 rows
                                </VChip>
                            </VCol>
                        </VRow>
                    </VWindowItem>
                </VWindow>
            </VCardText>
        </div>
    </VCard>
</template>

