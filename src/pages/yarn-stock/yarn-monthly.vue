<script setup lang="ts">
    import { AgGridVue } from 'ag-grid-vue3'
    import {ColDef,GridApi,GridReadyEvent,IDatasource,IGetRowsParams,RowModelType,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import LoadingGif from '@/assets/images/spinner.gif'
    import YarnMonthlyCartonRenderer from '@/views/yarn-monthly/yarn-monthly-carton-renderer.vue'

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'
    import { useDisplay } from 'vuetify'


    definePage({
        meta:{
            action:'read',
            subject:'yarn-monthly'
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
    myStore.currentPageTitle='Yarn Stock / Monthly Yarn'

    const now=new Date()
    const thisMonth=`${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-01 to ${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`
    const dateRange=ref(thisMonth)
    const isOrganic=ref(false)
    const loadings=ref<boolean[]>([])
    watch([dateRange,isOrganic],async([newDateRange,newIsOrganic],[oldDateRange,oldIsOrganic])=>{
        if (newDateRange !== oldDateRange || newIsOrganic !== oldIsOrganic) {
            clearGRid()
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
            headerName:'ID',field:'yarnId',type:'rightAligned',maxWidth:87,pinned:'left',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'equals' },
            suppressFloatingFilterButton:true, 
        },
        {
            field:'code',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Begin',
            children:[
                {
                    headerName:'Carton',field:'beginCarton',type:'rightAligned',
                    cellRenderer:'YarnMonthlyCartonRenderer',
                    cellRendererParams:{
                        values:[
                            {color:'#B388FF',label:'Begin'}
                        ]
                    },
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'background-color':'#b388ff1a'}
                        }
                    }
                },
                {
                    headerName:'Weight',field:'beginWeight',type:'rightAligned',
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'color':'#B388FF','background-color':'#b388ff1a'}
                        }
                    }
                },
                {
                    headerName:'Amount',field:'beginAmount',type:'rightAligned',
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'color':'#B388FF','background-color':'#b388ff1a'}
                        }
                    }
                },
            ],
        },
        {
            headerName:'In',
            children:[
                {
                    headerName:'Carton',field:'inCarton',type:'rightAligned',
                    cellRenderer:'YarnMonthlyCartonRenderer',
                    cellRendererParams:{
                        values:[
                            {color:'rgb(var(--v-theme-success))',label:'In'}
                        ]
                    },
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'background-color':'rgba(var(--v-theme-success),0.1)'}
                        }
                    }
                },
                {
                    headerName:'Weight',field:'inWeight',type:'rightAligned',
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'color':'rgb(var(--v-theme-success))','background-color':'rgba(var(--v-theme-success),0.1)'}
                        }
                    }
                },
            ],
        },
        {
            headerName:'Return',
            children:[
                {
                    headerName:'Carton',field:'returnCarton',type:'rightAligned',
                    cellRenderer:'YarnMonthlyCartonRenderer',
                    cellRendererParams:{
                        values:[
                            {color:'rgb(var(--v-theme-warning))',label:'Return'}
                        ]
                    },
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'background-color':'rgba(var(--v-theme-warning),0.1)'}
                        }
                    }
                },
                {
                    headerName:'Weight',field:'returnWeight',type:'rightAligned',
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'color':'rgb(var(--v-theme-warning))','background-color':'rgba(var(--v-theme-warning),0.1)'}
                        }
                    }
                },
            ],
        },
        {
            headerName:'Out',
            children:[
                {
                    headerName:'Carton',field:'outCarton',type:'rightAligned',
                    cellRenderer:'YarnMonthlyCartonRenderer',
                    cellRendererParams:{
                        values:[
                            {color:'rgb(var(--v-theme-error))',label:'Out'}
                        ]
                    },
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'background-color':'rgba(var(--v-theme-error),0.1)'}
                        }
                    }
                },
                {
                    headerName:'Weight',field:'outWeight',type:'rightAligned',
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'color':'rgb(var(--v-theme-error))','background-color':'rgba(var(--v-theme-error),0.1)'}
                        }
                    }
                },
            ],
        },
        {
            headerName:'Balance',
            children:[
                {
                    headerName:'Carton',field:'balanceCarton',type:'rightAligned',
                    cellRenderer:'YarnMonthlyCartonRenderer',
                    cellRendererParams:{
                        values:[
                            {color:'rgb(var(--v-theme-info))',label:'Balance'}
                        ]
                    },
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellStyle:(params:any)=>{
                         return {'color':'rgba(var(--v-theme-info)', 'background-color':'rgba(var(--v-theme-info),0.1)'}
                    }
                },
                {
                    headerName:'Weight',field:'balanceWeight',type:'rightAligned',
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(params.value)
                    },
                    cellStyle:(params:any)=>{
                        if(params.data){
                            return {'color':'rgb(var(--v-theme-info))','background-color':'rgba(var(--v-theme-info),0.1)'}
                        }
                    }
                },
                {
                    field:'dateSearch',hide:true,
                }
            ],
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
                    const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/yarn/GetYarnMonthlyPartial?dateSearch=${dateRange.value}&isOrganic=${isOrganic.value}&request=${JSON.stringify(request)}&exportExcel=false`)
                    if(footer){
                        rowFooter.value=[{
                            totalRows:footer.totalRows,
                            beginCarton : footer.beginCarton,
                            beginWeight:footer.beginWeight,
                            beginAmount:footer.beginAmount,
                            inCarton:footer.inCarton,
                            inWeight:footer.inWeight,
                            
                            returnCarton:footer.returnCarton,
                            returnWeight:footer.returnWeight,
                            outCarton:footer.outCarton,
                            outWeight:footer.outWeight,
                            balanceCarton : footer.balanceCarton,
                            balanceWeight:footer.balanceWeight
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
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/yarn/GetYarnMonthlyPartial?dateSearch=${dateRange.value}&isOrganic=${isOrganic.value}&request=${JSON.stringify(request)}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','YarnMonthly.xlsx')
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
    const clearGRid=()=>{
        const emptyDatasource:IDatasource={
                getRows:async(params:IGetRowsParams)=>{
                    params.successCallback([],0)
                }
            }
            gridApi.value?.setGridOption('datasource',emptyDatasource)
            rowFooter.value=[{
                totalRows:0,
                beginCarton : 0,
                beginWeight : 0,
                beginAmount : 0,
                inCarton : 0,
                inWeight : 0,
                returnCarton : 0,
                returnWeight : 0,
                outCarton : 0,
                outWeight : 0,
                balanceCarton : 0,
                balanceKgs:0,
            }]
    }

    defineExpose({
        YarnMonthlyCartonRenderer,
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
                <VCol cols="6" sm="4" md="3" lg="2" class="pa-1">
                    <VCheckbox
                        v-model="isOrganic"
                        label="เส้นด้าย Organic"
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

