<script setup lang="ts">
    import { AgGridVue } from 'ag-grid-vue3'
    import {ColDef,GridApi,GridReadyEvent,IDatasource,IGetRowsParams,RowModelType,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import DropDownFloatingFilter from '@/components/ag-grid/DropDownFloatingFilter.vue'
    import LoadingGif from '@/assets/images/spinner.gif'
    import itemMasterDialog from '@/views/item-master/item-master-dialog.vue'
    import { toast } from 'vue3-toastify'
    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'
    import { useDisplay } from 'vuetify'


    interface RowFooter{
        totalRows:number
    }

    definePage({
        meta:{
            action:'read',
            subject:'item-master',
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
    myStore.currentPageTitle='Fabric / Item Master'

    const rowFooter=ref<RowFooter|null>(null)
    const loadings=ref<boolean[]>([])
    const isDialogVisible=ref(false)
    const itemCode=ref('')
    const editMode=ref('add')
    const userData = useCookie<any>('userData').value
    const currentUser = userData?.username
    const isReloadGrid=ref(false)

    watchEffect(()=>{
        if(isReloadGrid.value) {
            console.log('reloadgrid')
            reloadGrid()
        }
    })

    // 👉 agGrid
    const gridApi=shallowRef<GridApi|null>(null)
    const columnDefs=ref([
        {
            headerName: '#',
            maxWidth: 60,pinned: 'left',type: 'rightAligned',
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
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Description',field:'description',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'PF Code Name',field:'pfCodeName',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Color',field:'color',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Season',field:'season',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Customer',field:'customer',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Model',field:'model',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Unit',field:'unit',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Price',field:'price',type: 'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'Work',field:'workType',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Section',field:'section',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Supplier',field:'supplier',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Code Sub',field:'codeSub',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Lab No.',field:'labNo',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Weight (GSM)',field:'weightGSM',type: 'rightAligned',
            wrapHeaderText: true,autoHeaderHeight:true,maxWidth: 62,
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'Width',field:'width',type: 'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'Washing',field:'washing',type: 'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'PH',field:'ph',type: 'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'Spirality',field:'spirality',type: 'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'Shrinkage',
            children:[
                {
                    headerName:'L',field:'shrinkageL',type: 'rightAligned',
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    }
                },
                {
                    headerName:'W',field:'shrinkageW',type: 'rightAligned',
                    valueFormatter:(params:any)=>{
                        return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
                    }
                },
            ]
        },
        {
            headerName:'Color Fastness',field:'colorFastness',type: 'rightAligned',
            valueFormatter:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            }
        },
        {
            headerName:'Fabric Content',field:'fabricContent',
        },
        {
            headerName:'Company',field:'company',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Type',field:'itemType',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Customer Code',field:'customerCode',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Last Update',field:'inputDate',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short',timeStyle:'short' }).format(d):null
                }
            },
            filter:'agDateColumnFilter',
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },
        {
            headerName:'Update User',field:'inputUser',
            filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
            floatingFilter:true,suppressFloatingFilterButton:true, 
        },


        
        
        // {
        //     headerName:'Fabric ID',field:'fabricId',type: 'rightAligned',
        //     filter: true, floatingFilter: true, filterParams: { defaultOption: 'equals' },
        //     suppressFloatingFilterButton:true,
        //     cellRenderer:(params:any)=>{
        //         if(params.data) return params.data.rowNumber===1?params.value:''
        //     } 
        // },
        
        
        // {
        //     headerName:'Section',field:'section',
        //     filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
        //     floatingFilter:true,
        //     suppressFloatingFilterButton:true, 
        //     cellRenderer:(params:any)=>{
        //         if(params.data) return params.data.rowNumber===1?params.value:''
        //     } 
        // },
        // {
        //     headerName:'Yarn ID',field:'yarnId',type: 'rightAligned',
        //     filter: true, floatingFilter: true, filterParams: { defaultOption: 'equals' },
        //     suppressFloatingFilterButton:true,
        // },
        // {
        //     headerName:'Yarn Name',field:'yarnName',
        //     filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
        //     floatingFilter:true,
        //     suppressFloatingFilterButton:true, 
        // },
        // {
        //     headerName:'Use%',field:'percentUse',type: 'rightAligned',
        //     wrapHeaderText: true, autoHeaderHeight: true, maxWidth: 53,
        // },
        // {
        //     headerName:'Loss%',field:'loss',type: 'rightAligned',
        //     wrapHeaderText: true, autoHeaderHeight: true, maxWidth: 56,
        // },
        // {
        //     headerName:'Lead Time (days)',field:'release',type: 'rightAligned',
        //     wrapHeaderText: true, autoHeaderHeight: true,maxWidth:82,
        // },
        // {
        //     headerName:'Supplier',field:'supplier',
        //     filter:'agTextColumnFilter',filterParams: { defaultOption: 'startsWith' },
        //     floatingFilter:true,
        //     suppressFloatingFilterButton:true, 
        // },
        
        // {headerName:'Update User',field:'inputUser'},

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
                    const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/GetItemMasterPartial?request=${JSON.stringify(request)}&exportExcel=false`)
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

    // 👉 Reload Grid
    const reloadGrid=()=>{
        loadings.value[0]=true
        gridApi.value?.getFilterModel() // to ensure filter is applied
        gridApi.value?.onFilterChanged()
        loadings.value[0]=false
        isReloadGrid.value=false
    }

    // 👉 Add new data
    const addData=()=>{
        editMode.value='add'
        itemCode.value=''
        isDialogVisible.value=true
    }

    // 👉 Edit data
    const editData=()=>{
        editMode.value='edit'
        const selectedRows=gridApi.value?.getSelectedRows()??[]
        if(selectedRows.length>0){
            isDialogVisible.value=true
            itemCode.value=selectedRows[0].code
        }
    }

    // 👉 Export Excel
    const exportExcel=async()=>{
        try {
            loadings.value[1]=true
            const request={startRow:0,endRow:0,filterModel:gridApi.value?.getFilterModel(),sortModel:null}
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/GetItemMasterPartial?request=${JSON.stringify(request)}&exportExcel=true&exportExcel2=false`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','ItemMaster.xlsx')
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

    // 👉 Upload file
    const uploadFile=async()=>{

    }

    // 👉 Delete
    const deleteData=async()=>{
        const selectedRows=gridApi.value?.getSelectedRows()??[]
        if(selectedRows.length>0){
            const inputUser=selectedRows[0].inputUser
            if(currentUser===inputUser){
                if (!confirm('Do you want to delete this item code: '+selectedRows[0].code+' ?\nคุณต้องการลบ item code: '+selectedRows[0].code+' นี้ใช่หรือไม่')) return;
                loadings.value[3]=true
                try {
                    const res=await $api(`${import.meta.env.BASE_URL}api/fabric/ItemMasterDelete?code=${selectedRows[0].code}`,{
                        method:'DELETE',
                        onResponseError({response}){
                            if(response?._data.message)
                                toast.error(response._data.message)
                            else
                                toast.error(JSON.stringify(response?._data.errors))
                        }
                    })
                    gridApi.value?.getFilterModel();
                    gridApi.value?.onFilterChanged();
                } catch (error) {
                    console.log(error)
                }
                loadings.value[3]=false
            }else{
                toast.error('You can delete only your item code.<br/>คุณสามารถลบข้อมูลได้เฉพาะ item code ที่คุณสร้างได้เท่านั้น!')
            }
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
                :rowHeight="35"
                rowSelection="single"
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
                    <VTooltip text="Reload Grid">
                        <template v-slot:activator="{props}">
                            <VBtn
                                v-bind="props" 
                                class="mx-1"
                                icon="tabler-refresh"
                                rounded
                                size="small"
                                :loading="loadings[0]"
                                :disabled="loadings[0]"
                                @click="reloadGrid()"
                            />
                        </template>
                    </VTooltip>
                    <VTooltip text="Add">
                        <template v-slot:activator="{props}">
                            <VBtn
                                v-bind="props"
                                class="me-1"
                                icon="tabler-plus"
                                rounded
                                size="small"
                                @click="addData()"
                            />
                        </template>
                    </VTooltip>
                    <VTooltip text="Edit">
                        <template v-slot:activator="{props}">
                            <VBtn
                                v-bind="props"
                                class="me-1"
                                color="warning"
                                icon="tabler-pencil"
                                rounded
                                size="small"
                                @click="editData()"
                            />
                        </template>
                    </VTooltip>
                    <VTooltip text="Export Excel">
                        <template v-slot:activator="{props}">
                            <VBtn
                                v-bind="props"
                                class="me-1"
                                color="success"
                                icon="tabler-file-excel"
                                rounded
                                size="small"
                                :loading="loadings[1]"
                                :disabled="loadings[1]"
                                @click="exportExcel()"
                            />
                        </template>
                    </VTooltip>
                    <VTooltip text="Upload File">
                        <template v-slot:activator="{props}">
                            <VBtn
                                v-bind="props"
                                class="me-1"
                                color="info"
                                icon="tabler-file-upload"
                                rounded
                                size="small"
                                :loading="loadings[2]"
                                :disabled="loadings[2]"
                                @click="uploadFile()"
                            />
                        </template>
                    </VTooltip>
                    <VTooltip text="Delete">
                        <template v-slot:activator="{props}">
                            <VBtn
                                v-bind="props"
                                class="me-1"
                                color="error"
                                icon="tabler-trash"
                                rounded
                                size="small"
                                :loading="loadings[3]"
                                :disabled="loadings[3]"
                                @click="deleteData()"
                            />
                        </template>
                    </VTooltip>
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
    
    <itemMasterDialog
        v-model:is-dialog-visible="isDialogVisible"
        v-model:is-reload-grid="isReloadGrid"
        :edit-mode="editMode"
        :item-code="itemCode"
    />
</template>
