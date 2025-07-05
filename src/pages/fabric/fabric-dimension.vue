<script setup lang="ts">
    import { AgGridVue } from 'ag-grid-vue3'
    import {ColDef,GridApi,GridReadyEvent,IDatasource,IGetRowsParams,RowModelType,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import DropDownFloatingFilter from '@/components/ag-grid/DropDownFloatingFilter.vue'
    import LoadingGif from '@/assets/images/spinner.gif'

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'
    import { useDisplay } from 'vuetify'

    definePage({
        meta:{
            action:'read',
            subject:'fabric-dimension'
        }
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
    myStore.currentPageTitle='Fabric / Fabric Dimension'

    const rowFooter=ref({})
    const loadings=ref<boolean[]>([])

    // 👉 agGrid
    const gridApi=shallowRef<GridApi|null>(null)
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
            headerName:'Date',field:'delDate',minWidth:105,
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                const d=new Date(params.value)
                return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):''
            },
        },
        {
            headerName:'Rec No.',field:'recNo',minWidth:96,
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        { 
            headerName: "Fabric Code", field: "fabricCode",
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' }, 
            suppressFloatingFilterButton:true, 
        },
        { 
            headerName: "Color", field: "color",
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Dimension change after 24 hr holding',
            children:[
                { 
                    headerName: "Width Cm", field: "width24H", type:'rightAligned',maxWidth:95,
                    wrapHeaderText:true,headerClass:'text-center',
                },
                { 
                    headerName: "Length Cm", field: "length24H",type:'rightAligned',maxWidth:100,
                    wrapHeaderText:true,headerClass:'text-center',
                },
                {
                    headerName:'Density',
                    children:[
                        {
                            headerName:'C',field:'cw24H',type:'rightAligned',
                            cellRenderer:(params:any)=>{
                                if(params.value){
                                    var temp = params.value.split('/')
                                    return temp[0]
                                }else{
                                    return ''
                                }
                            },
                            headerClass:'text-center',
                        },
                        {
                            headerName:'W',type:'rightAligned',
                            valueGetter:(params:any)=>{
                                if(params.data){
                                    if(params.data.cw24H){
                                        var temp = params.data.cw24H.split('/')
                                        return temp[1]
                                    }else{
                                        return ''
                                    }
                                    
                                }else{
                                    return ''
                                }
                            },
                            headerClass:'text-center',
                        }
                    ]
                },
                {
                    headerName:'Weight g/m²',field:'weight24H',type:'rightAligned',maxWidth:113,
                    wrapHeaderText:true,headerClass:'text-center',
                }
            ],
        },
        {
            headerName:'Dimension change after 48 hr holding',
            children:[
                {
                    headerName:'Width Cm',field:'width48H',type:'rightAligned',maxWidth:95,
                    wrapHeaderText:true,headerClass:'text-center',
                },
                {
                    headerName:'Length',field:'length48H',type:'rightAligned',maxWidth:100,
                    wrapHeaderText:true,headerClass:'text-center',
                },
                {
                    headerName:'Density',
                    children:[
                        {
                            headerName:'C',field:'cw48H',type:'rightAligned',
                            cellRenderer:(params:any)=>{
                                if(params.value){
                                    var temp = params.value.split('/')
                                    return temp[0]
                                }else{
                                    return ''
                                }
                            },
                            headerClass:'text-center',
                        },
                        {
                            headerName:'W',type:'rightAligned',
                            valueGetter:(params:any)=>{
                                if(params.data){
                                    if(params.data.cw48H){
                                        var temp = params.data.cw48H.split('/')
                                        return temp[1]
                                    }else{
                                        return ''
                                    }
                                }else{
                                    return ''
                                }
                            },
                            headerClass:'text-center',
                        }
                    ]
                },
                {
                    headerName:'Weight g/m²',field:"weight48H",type: 'rightAligned',maxWidth:113,
                    wrapHeaderText:true,headerClass:'text-center',
                }
            ],
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
                    {'text':'SALES1','value':'SALES1'},
                    {'text':'Sales2','value':'Sales2'},
                    {'text':'SALES3','value':'SALES3'},
                    {'text':'Sales4','value':'Sales4'},
                    {'text':'SALES5','value':'SALES5'},
                    {'text':'SALES6','value':'SALES6'},
                    {'text':'Inter','value':'Inter'},
                    {'text':'Direct Sales','value':'Direct Sales'},
                    {'text':'Riki','value':'Riki'},
                    {'text':'Riki(S3)','value':'Riki(S3)'},
                    {'text':'Riki(RG)','value':'Riki(RG)'},
                    {'text':'Parfun','value':'Parfun'},
                    {'text':'Fabric','value':'Fabric'}
                ]
            },
            suppressFloatingFilterButton:true,
        },

       

    ])
    const defaultColDef = ref<ColDef>({
      sortable: false,
      resizable:true,
      suppressHeaderMenuButton:true,
      width:100,
    });
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

    const onGridReady=(params:GridReadyEvent)=>{
        gridApi.value=params.api

        const dataSource:IDatasource={
            rowCount:undefined,
            getRows:async(params:IGetRowsParams)=>{
                try {
                    const request={startRow:params.startRow,endRow:params.endRow,filterModel:params.filterModel,sortModel:params.sortModel}
                    const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getfabricdimension?request=${JSON.stringify(request)}&exportExcel=false`)
                    rowFooter.value=footer
                    
                    const totalCount=(footer)?footer.totalRows:0
                    const lastRow=params.endRow>=totalCount?totalCount:-1    
                    params.successCallback(data,lastRow)
                    gridApi.value?.autoSizeAllColumns()
                } catch (error) {
                    console.log(error)
                    params.failCallback()
                }
            }
        }
        params.api!.setGridOption('datasource',dataSource)
    }

    // 👉 Export Excel
    const exportExcel=async()=>{
        try {
            loadings.value[0]=true
            const request={startRow:0,endRow:0,filterModel:gridApi.value?.getFilterModel(),sortModel:null}
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getfabricdimension?request=${JSON.stringify(request)}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','fabric-dimension.xlsx')
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

    onMounted(()=>{
        const {width,height}=useWindowSize()
        const {name}=useDisplay()
        const gridHeight=computed(()=>{
            let headerHeight=0
            switch(name.value){
                case 'xs': 
                    headerHeight= 160
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
        gridApi.value?.setGridOption('domLayout','normal')
        document.getElementById('myGrid')!.style.height=gridHeight.value+'px'
    })

    defineExpose({
        DropDownFloatingFilter
    })
</script>
<template>
    <VCard>
        <VCardText class="px-1 pt-1 pb-0">
            <ag-grid-vue
                id="myGrid"
                @gridReady="onGridReady"
                :autoSizeStrategy="autoSizeStrategy"
                :class=myStore.agGridthemeClass
                :columnDefs="columnDefs"
                :defaultColDef="defaultColDef"
                :headerHeight="38"
                :row-height="35"
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
                <VCol cols="6" class="py-1">
                    <VBtn
                        size="small"
                        color="success"
                        class="ms-1"
                        :loading="loadings[0]"
                        :disabled="loadings[0]"
                        @click="exportExcel()"
                    >
                        <VIcon start icon="tabler-file-spreadsheet"/>    
                    Export Excel
                    </VBtn>
                </VCol>
                <VCol 
                    cols="6"
                    class="d-flex justify-end ms-auto py-1"
                >
                    <VChip 
                        v-if="rowFooter"
                        color="#E91E63"
                    >
                        {{ new Intl.NumberFormat().format(rowFooter.totalRows)}} rows
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

