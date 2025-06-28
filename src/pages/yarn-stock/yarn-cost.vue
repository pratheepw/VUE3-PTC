<script setup lang="ts">
    import { AgGridVue } from 'ag-grid-vue3'
    import {ColDef,GridApi,GridReadyEvent,IDatasource,IGetRowsParams,RowModelType,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import LoadingGif from '@/assets/images/spinner.gif'
    import YarnCostYarnidRenderer from '@/views/yarn-cost/yarn-cost-yarnid-renderer.vue'
    import DropDownFloatingFilter from '@/components/ag-grid/DropDownFloatingFilter.vue'
    import VIconRenderer from '@/components/ag-grid/VIconRenderer.vue'

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'
    import { useDisplay } from 'vuetify'



    definePage({
        meta:{
            action:'read',
            subject:'yarn-cost'
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
    myStore.currentPageTitle='Yarn Stock / Yarn Cost'

    const month=ref(new Date().getMonth()+1)
    const year=ref(new Date().getFullYear())
    const items=[
        {title:'January',value:1},
        {title:'February',value:2},
        {title:'March',value:3},
        {title:'April',value:4},
        {title:'May',value:5},
        {title:'June',value:6},
        {title:'July',value:7},
        {title:'August',value:8},
        {title:'September',value:9},
        {title:'October',value:10},
        {title:'November',value:11},
        {title:'December',value:12}        
    ]
    const loadings=ref<boolean[]>([])
    watch(month,async(newValue,oldValue)=>{
        if (newValue !== oldValue) {
            clearGRid()
        }
    })
    watch(year,async(newValue,oldValue)=>{
         if (newValue !== oldValue) {
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
            headerName:'ID',field:'yarnId',type:'rightAligned',maxWidth:87,
            cellRenderer:'YarnCostYarnidRenderer',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'equals' },
            suppressFloatingFilterButton:true, 
        },
        {   headerName:'Sample',field:'sample',
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
            field:'cost',type:'rightAligned',
             cellRenderer:(params:any)=>{
                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
             }
        },
        {
            headerName:'Begin',
            children:[
                {
                    headerName:'Ctns',field:'beginCarton',type:'rightAligned',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellStyle:{'color':'#B388FF'}
                },
                {
                    headerName:'Kgs',field:'beginKgs',type:'rightAligned',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellStyle:{'color':'#B388FF'}
                },
                {
                    headerName:'Price',field:'beginPrice',type:'rightAligned',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellStyle:{'color':'#B388FF'}
                },
                {
                    headerName:'Amt',field:'beginAmount',type:'rightAligned',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellStyle:{'color':'#B388FF'}
                },
            ],
        },
        {
            headerName:'In',
            children:[
                {
                    headerName:'Ctns',field:'inCarton',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-success','text-end'],
                },
                {
                    headerName:'Kgs',field:'inKgs',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-success','text-end'],
                },
                {
                    headerName:'Price',field:'inPrice',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-success','text-end'],
                },
                {
                    headerName:'Amt',field:'inAmount',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-success','text-end'],
                },
            ],
        },
        {
            headerName:'Return',
            children:[
                {
                    headerName:'Ctns',field:'returnCarton',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-warning','text-end'],
                },
                {
                    headerName:'Kgs',field:'returnKgs',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-warning','text-end'],
                },
            ],
        },
        {
            headerName:'Out',
            children:[
                {
                    headerName:'Ctns',field:'outCarton',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-error','text-end'],
                },
                {
                    headerName:'Kgs',field:'outKgs',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-error','text-end'],
                },
                {
                    headerName:'Amt',field:'outAmount',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-error','text-end'],
                },
            ],
        },
        {
            headerName:'Balance',
            children:[
                {
                    headerName:'Ctns',field:'balanceCarton',pinned:'right',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-info','text-end'],
                },
                {
                    headerName:'Kgs',field:'balanceKgs',pinned:'right',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-info','text-end'],
                },
                {
                    headerName:'Amt',field:'balanceAmount',pinned:'right',
                    cellRenderer:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    },
                    cellClass:['text-info','text-end'],
                },
            ],
        },
        {field:'code'},
        {field:'mixed'},
        {field:'supplier'},
        {field:'department'},
        {field:'beginDepartment'},
        {field:'monthYear',hide:true},
        // 
        // {
        //     headerName:'Status',field:'status',
        //     cellRenderer:'VChipRenderer',
        //     cellRendererParams:{
        //         values:[
        //             {color:'success',text:'In',value:'In'},
        //             {color:'warning',text:'Return',value:'Return'},
        //             {color:'error',text:'Out',value:'Out'}
        //         ]
        //     },
        //     cellClass:'d-flex align-center',
        // },
        
        // {
        //     field:'code',
        // },
        // {
        //     headerName:'From',field:'recFrom',
        // },
        
        
        // {
        //     headerName:'Doc No.',field:'docNo',
        // },
        // {
        //     headerName:'PO NO.',field:'poNo',
        // },
        // {
        //     headerName:'Delivery No.',field:'deliveryNo',
        // },
        // {
        //     headerName:'Lot No.',field:'lotNo',
        // },
        
        // {
        //     headerName:'Doc Date',field:'docDate',
        //     cellDataType:'date',
        //      cellRenderer:(params:any)=>{
        //          return params.value?params.value.substr(0,10):null
        //      }
        // },

        

        
        // {
        //     field:'time',maxWidth:143,
        //     cellDataType:'date',
        //     cellRenderer:(params:any)=>{
        //         return params.value?params.value.substr(0,16).replace('T',' '):null
        //     }
        // },
        
        // {
        //     headerName:'Fabric',field:'fabricCode',
        //     filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
        //     cellRenderer:'DailyDeliveryCodeRenderer',
        // },
        // {
        //     field:'color',
        //     filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
        // },
        // {
        //     headerName:'Lot No.',field:'lotNo',
        //     filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
        // },
        // {
        //     headerName:'Fabric Order No.',field:'fabOrderNo',maxWidth:118,
        //     wrapHeaderText:true,autoHeaderHeight:true,
        //     filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
        // },
        // {
        //     field:'customerPo',
        //     filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
        // },
        // {
        //     headerName:'Pcs.',field:'pcs',type:'rightAligned',
        //     cellRenderer:(params:any)=>{
        //         return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //     }
        // },
        // {
        //     headerName:'Kgs.',field:'weight',type:'rightAligned',
        //     cellRenderer:(params:any)=>{
        //         return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //     }
        // },
        // {
        //     field:'piece',type:'rightAligned',
        //     cellRenderer:(params:any)=>{
        //         return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //     }
        // },
        // {
        //     field:'length',type:'rightAligned',
        //     cellRenderer:(params:any)=>{
        //         return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //     }
        // },
        // {
        //     headerName:'RT',
        //     children:[
        //         {
        //             headerName:'Pcs.',field:'rPcs',type:'rightAligned',
        //             cellRenderer:(params:any)=>{
        //                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //             }
        //         },
        //         {
        //             headerName:'Kgs.',field:'rWeight',type:'rightAligned',
        //             cellRenderer:(params:any)=>{
        //                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //             }
        //         },
        //         {
        //             headerName:'Piece',field:'rPiece',type:'rightAligned',
        //             cellRenderer:(params:any)=>{
        //                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //             }
        //         },
        //         {
        //             headerName:'Length',field:'rLength',type:'rightAligned',
        //             cellRenderer:(params:any)=>{
        //                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //             }
        //         },        
        //     ]
        // },
        // {
        //     headerName:'Sample',
        //     children:[
        //         {
        //             headerName:'Pcs.',field:'sPcs',type:'rightAligned',
        //             cellRenderer:(params:any)=>{
        //                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //             }
        //         },
        //         {
        //             headerName:'Kgs.',field:'sWeight',type:'rightAligned',
        //             cellRenderer:(params:any)=>{
        //                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //             }
        //         },
        //         {
        //             headerName:'Piece',field:'sPiece',type:'rightAligned',
        //             cellRenderer:(params:any)=>{
        //                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //             }
        //         },
        //         {
        //             headerName:'Length',field:'sLength',type:'rightAligned',
        //             cellRenderer:(params:any)=>{
        //                 return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
        //             }
        //         },        
        //     ]
        // },
        // {
        //     headerName: "Section", field: "section", 
        //     filter:'agTextColumnFilter',
        //     filterParams:{
        //         filterOptions: ["equals"],
        //         maxNumConditions: 1
        //     },
        //     floatingFilter:true,
        //     floatingFilterComponent:'DropDownFloatingFilter',
        //     floatingFilterComponentParams:{
        //          values: [
        //             { 'text': 'All', 'value': '' },
        //             {'text':'SAI4','value':'SAI4'},
        //             {'text':'SALES1','value':'SALES1'},
        //             {'text':'SALES2','value':'SALES2'},
        //             {'text':'SALES3','value':'SALES3'},
        //             {'text':'SALES4','value':'SALES4'},
        //             {'text':'SALES5','value':'SALES5'},
        //             {'text':'THAI PARFUN','value':'THAI PARFUN'}
        //         ],
            
        //     },
        //     suppressFloatingFilterButton:true,
        // },
        // {
        //     field:'customer',
        //     filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
        // },
        // {
        //     field:'billNo',
        //     filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
        // },

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
                    const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/yarn/getyarncostpartial?year=${year.value}&month=${month.value.toString().padStart(2,'0')}&request=${JSON.stringify(request)}&exportExcel=false`)
                    if(footer){
                        rowFooter.value=[{
                            totalRows:footer.totalRows,
                            beginCarton : footer.beginCarton,
                            beginKgs:footer.beginKgs,
                            beginAmount:footer.beginAmount,
                            inCarton:footer.inCarton,
                            inKgs:footer.inKgs,
                            inAmount:footer.inAmount,
                            returnCarton:footer.returnCarton,
                            returnKgs:footer.returnKgs,
                            outCarton:footer.outCarton,
                            outKgs:footer.outKgs,
                            outAmount:footer.outAmount,
                            balanceCarton : footer.balanceCarton,
                            balanceKgs:footer.balanceKgs,
                            balanceAmount:footer.balanceAmount
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
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/yarn/getyarncostpartial?year=${year.value}&month=${month.value.toString().padStart(2,'0')}&request=${JSON.stringify(request)}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','YarnCost.xlsx')
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
                beginKgs : 0,
                beginAmount : 0,
                inCarton : 0,
                inKgs : 0,
                inAmount : 0,
                returnCarton : 0,
                returnKgs : 0,
                outCarton : 0,
                outKgs : 0,
                outAmount : 0,
                balanceCarton : 0,
                balanceKgs:0,
                balanceAmount:0
            }]
    }

    defineExpose({
        YarnCostYarnidRenderer,
        DropDownFloatingFilter,
        VIconRenderer,
    })
</script>
<template>
    <VCard>
        <VCardText class="px-1 py-1">
            <VRow no-gutters>
                <VCol cols="10" sm="6" md="4" lg="3" xl="2"  class="pa-1 d-flex gap-1">
                    <VSelect
                        v-model="month"
                        :items="items"
                        item-title="title"
                        item-value="value"
                        label="Select Month"
                    />
                    <VTextField
                        v-model="year"
                        label="Year"
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

