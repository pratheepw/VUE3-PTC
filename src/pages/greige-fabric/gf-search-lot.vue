<script setup lang="ts">
    import { AgGridVue } from 'ag-grid-vue3'
    import {ColDef,GridApi,GridReadyEvent,IDatasource,IGetRowsParams,RowModelType,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'
    import { useDisplay } from 'vuetify'

    definePage({
        meta:{
            action:'read',
            subject:'gf-search-lot'
        }
    })

    // 👉 Get window size
    const {width,height}=useWindowSize()
    const {name}=useDisplay()
    const gridHeight=computed(()=>{
        let headerHeight=0
        switch(name.value){
            case 'xs': 
                headerHeight= 200
                break
            case 'sm': 
                headerHeight= 200
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
    myStore.currentPageTitle='Greige Fabric Stock / Search Lot No.'

    const ddlType=ref('Lot No')
    const txtSearch=ref('')
    const loadings=ref<boolean[]>([])
    watch([ddlType,txtSearch],async([newDdlType,newTxtSearch],[oldDdlType,oldTxtSearch])=>{
        if (newDdlType !== oldDdlType || newTxtSearch !== oldTxtSearch) {
            clearGrid()
        }
    })

    // 👉 agGrid
    const gridApi=shallowRef<GridApi|null>(null)
    const rowData=ref([])
    const rowFooter=ref<any>()

    const columnDefs=ref([
        {headerName:'Issue No.',field:'issue'},
        {
            headerName:'Date',field:'outDate',
            cellDataType:'date',
            valueFormatter:(params:any)=>{
                if(params.value){
                    const d=new Date(params.value)
                    return (d instanceof Date && !isNaN(d.getTime())) ? new Intl.DateTimeFormat('en-GB', {dateStyle: 'short' }).format(d):null
                }
            },
        },
        {headerName:'Lot No.', field:'lotNo'},
        {field:'code'},
        {headerName:'Piece No.', field:'pieceNo'},
        {
            field:'weight',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {field:'color'},
        {headerName:'Order No.', field:'fabOrderNo'},
        {
            headerName:'1', field:'k1',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'2', field:'k2',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'3', field:'k3',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'4', field:'k4',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'5', field:'k5',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'6', field:'k6',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'7', field:'k7',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'8', field:'k8',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'9', field:'k9',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'10', field:'k10',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'11', field:'k11',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            field:'iso',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
            cellClassRules:{
                'text-bold':(params:any)=>params.node.rowPinned
            }
        },
        {
            headerName:'Employee', field:'empName',
        },
        {
            headerName:'Yarn LotNo.', field:'yarnLotNo',
            wrapText:true,autoHeight:true,
            cellClass:'text-small',
            cellRenderer:(params:any)=>{
                return params.value?params.value.toString().replaceAll(',','<br/>'):null
            }
        },
        {
            field:'yarnName',
            wrapText:true,autoHeight:true,
            cellClass:'text-small',
            cellRenderer:(params:any)=>{
                return params.value?params.value.toString().replaceAll(',','<br/>'):null
            }
        }

    ])
    const defaultColDef = ref<ColDef>({
      sortable: false,
      resizable:true,
      suppressHeaderMenuButton:true,
      width:100,
    });
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

    const onGridReady=(params:GridReadyEvent)=>{
        gridApi.value=params.api
        gridApi.value?.setGridOption('domLayout','normal')
        document.getElementById('grid1')!.style.height=gridHeight.value+'px'
    }

    // 👉 Fetching data
    const fetchData=async()=>{
        try {
            loadings.value[0]=true
            const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfsearchlot?ddlType=${ddlType.value}&txtSearch=${txtSearch.value}&exportExcel=false`)
            rowData.value=data
            if(footer){
                rowFooter.value=[{
                    totalRows:footer.totalRows,
                    weight:footer.weight,
                    k1:footer.k1,
                    k2:footer.k2,
                    k3:footer.k3,
                    k4:footer.k4,
                    k5:footer.k5,
                    k6:footer.k6,
                    k7:footer.k7,
                    k8:footer.k8,
                    k9:footer.k9,
                    k10:footer.k10,
                    k11:footer.k11,
                    iso:footer.iso
                }]
            }
            gridApi.value?.autoSizeAllColumns()
            loadings.value[0]=false
        } catch (error) {
            loadings.value[0]=false
            console.log(error)
        }
    }

    // 👉 Export Excel
    const exportExcel=async()=>{
        try {
            loadings.value[1]=true
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfsearchlot?ddlType=${ddlType.value}&txtSearch=${txtSearch.value}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','gfsearchlot.xlsx')
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
        rowData.value=[]
        rowFooter.value=undefined
    }

</script>
<template>
    <VCard>
        <VCardText class="px-1 py-1">
            <VRow no-gutters>
                <VCol cols="6" md="3" lg="2" class="pa-1">
                    <VSelect
                        v-model="ddlType"
                        :items="['Lot No','Fabric Order No']"
                        label="Search by"
                    />
                </VCol>
                <VCol cols="6" md="3" lg="2" class="pa-1">
                    <AppTextField
                        id="txtSearch"
                        v-model="txtSearch"
                    />
                </VCol>
                <VCol cols="8" md="4" lg="3" class="pa-1">
                    <VBtn
                        color="primary"
                        :loading="loadings[0]"
                        :disabled="loadings[0]"
                        @click="fetchData()"
                    >
                        <VIcon start icon="tabler-search"/>    
                        Search
                    </VBtn>
                </VCol>
                <VCol cols="12" class="py-1">
                    <AgGridVue
                id="grid1"
                @gridReady="onGridReady"
                :autoSizeStrategy="autoSizeStrategy"
                :class="myStore.agGridthemeClass"
                :columnDefs="columnDefs"
                :defaultColDef="defaultColDef"
                :headerHeight="38"
                :pinnedBottomRowData="rowFooter"
                :row-height="35"
                :rowData="rowData"
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

