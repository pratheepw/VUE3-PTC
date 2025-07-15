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
            subject:'shrinkage'
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
    myStore.currentPageTitle='Dyeing / Shrinkage'

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
            headerName:'In Date',field:'inDate',pinned:'left',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short',timeStyle:'short' }).format(d):null
                }
            },

            filter:'agDateColumnFilter',
            floatingFilter:true,
            suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Lot No.',field:'lotNo',pinned:'left',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
        },
        { 
            headerName: "Fabric", field: "fabric",pinned:'left',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' }, 
            suppressFloatingFilterButton:true, 
        },
        { 
            headerName: "Color", field: "color",pinned:'left',
            filter: true, floatingFilter: true, filterParams: { defaultOption: 'startsWith' },
            suppressFloatingFilterButton:true, 
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
                    {'text':'SALES3','value':'SALES3'},
                    {'text':'SALES4','value':'SALES4'},
                    {'text':'SALES5','value':'SALES5'},
                    {'text':'THAI PARFUN','value':'THAI PARFUN'}
                ],
            
            },
            suppressFloatingFilterButton:true,
        },
        { 
            headerName: "Piece No.", field: "pieceNo",
        },
        {
            headerName:'Course',
            children: [
                    { headerName: 'Lab', field:'courseLab', type: 'rightAligned' },
                    { headerName: 'Std', field:'courseStd', type: 'rightAligned'},
                    { headerName: 'Allowance', field:'courseAllowance', type: 'rightAligned'}
                ]
        },
        {
            headerName:'Width (cm.)',
            children:[
                {
                    headerName: 'Lab', field: 'widthCm', type: 'rightAligned',
                        cellStyle: (params:any) => {
                            if (params.data) {
                                let standard = parseFloat(params.data.widthStd);
                                let allowance = params.data.widthAllowance;
                                let min = standard;
                                let max = standard;
                                if (allowance.indexOf('+/-') > -1) {
                                    let ary = allowance.split('+/-');
                                    min = min - parseFloat(ary[1]);
                                    max = max + parseFloat(ary[1]);
                                } else if (allowance.indexOf('/') > -1) {
                                    let ary = allowance.split('/');
                                    ary.forEach((e:any) => {
                                        let value = parseFloat(e);
                                        if (value > 0)
                                            max = max + value;
                                        else if (value < 0)
                                            min = min + value;
                                    });
                                } else {
                                    let value = parseFloat(allowance);
                                    if (value > 0)
                                        max = max + value;
                                    else if (value < 0)
                                        min = min + value;
                                }

                                if (params.value < min || params.value > max) return { 'color': '#FF4C51', 'font-weight':'bold'  }

                            }
                        },
                },
                { headerName: 'Std', field: 'widthStd', type: 'rightAligned' },
                { headerName: 'Allowance', field: 'widthAllowance', type: 'rightAligned' }
            ]
        },
        {
            headerName:'Weight (g/m2)',
            children:[
                { headerName: 'Weight (gm)', field: 'weight', type: 'rightAligned',wrapHeaderText:true,maxWidth:80 },
                {
                    headerName: 'Lab', field: 'weightLab', type: 'rightAligned',
                    cellStyle: (params:any) => {
                        if (params.data) {
                            let standard = parseFloat(params.data.weightStd);
                            let allowance = params.data.weightAllowance;
                            let min = standard;
                            let max = standard;
                            if (allowance.indexOf('+/-') > -1) {
                                let ary = allowance.split('+/-');
                                min = min - parseFloat(ary[1]);
                                max = max + parseFloat(ary[1]);
                            } else if (allowance.indexOf('/') > -1) {
                                let ary = allowance.split('/');
                                ary.forEach((e:any) => {
                                    let value = parseFloat(e);
                                    if (value > 0)
                                        max = max + value;
                                    else if (value < 0)
                                        min = min + value;
                                });
                            } else {
                                let value = parseFloat(allowance);
                                if (value > 0)
                                    max = max + value;
                                else if (value < 0)
                                    min = min + value;
                            }

                            if (params.value < min || params.value > max)  return { 'color': '#FF4C51', 'font-weight':'bold'  }
                        }
                    }
                },
                { headerName: 'Std', field: 'weightStd', type: 'rightAligned' },
                { headerName: 'Allowance', field: 'weightAllowance', type: 'rightAligned' }
            ]
        },
        {
            headerName:'Shrinkage (100%)',
            children: [
                    {
                        headerName: 'Line',
                        children: [
                            { headerName: 'V', field:'lineV' },
                            { headerName: 'H', field:'lineH'}
                        ]
                    },
                    {
                        headerName: 'Tumble',
                        children: [
                            { headerName: 'V', field:'tumbleV' },
                            { headerName: 'H', field:'tumbleH' }
                        ]
                    },
                    {
                        headerName: 'Std',
                        children: [
                            { headerName: 'V', field:'stdV' },
                            { headerName: 'H', field:'stdH' }
                        ]
                    }
                ]
        },
        {
            headerName:'Brusting',
            children: [
                    { headerName: 'Lab', field:'brustingLab' },
                    { headerName: 'Std', field:'brustingStd'}
                ]
        },
        {
            headerName:'Spirality',
            children: [
                    {
                        headerName: 'Lab',
                        children: [
                            { headerName: 'Before', field:'labBefore' },
                            { headerName: 'After', field:'labAfter'}
                        ]
                    },
                    {
                        headerName: 'Std',
                        children: [
                            { headerName: 'Before', field:'stdBefore'},
                            { headerName: 'After', field:'stdAfter' }
                        ]
                    },
                ]
        },
        {
            headerName:'pH',
            children: [
                    { headerName: 'Lab', field:'phLab' },
                    { headerName: 'Std', field:'phStd' },
                    { headerName: 'Allowance', field:'phStd'}
                ]
        },
        {headerName:'Remark',field:'remark'},

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
                    const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/dyeing/GetShrinkagePartial?request=${JSON.stringify(request)}&exportExcel=false`)
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
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/dyeing/GetShrinkagePartial?request=${JSON.stringify(request)}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','Shrinkage.xlsx')
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
                    headerHeight= 150
                    break
                case 'sm': 
                    headerHeight= 150
                    break
                case 'md': 
                    headerHeight= 150
                    break
                case 'lg': 
                    headerHeight= 150
                    break
                case 'xl': 
                    headerHeight= 150
                    break
                case 'xxl': 
                    headerHeight= 150
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

