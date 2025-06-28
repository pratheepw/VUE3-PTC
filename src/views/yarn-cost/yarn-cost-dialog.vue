<script setup lang="ts">
    import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
    import { AgGridVue } from 'ag-grid-vue3';
    import {ColDef,GridApi,GridReadyEvent,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    import LoadingGif from '@/assets/images/spinner.gif'
    import VIconRenderer from '@/components/ag-grid/VIconRenderer.vue';

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'

    const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
    const props=defineProps({
        monthYear:String,
        yarnId:Number,
        sample:Boolean,
    })

    // 👉 Set agGrid theme
    const myStore = useMyStore()
    const configStore=useConfigStore()
    watch(()=>configStore.theme,(newValue,oldValue)=>{
        const userPreferredColorScheme = usePreferredColorScheme()
        const userTheme=userPreferredColorScheme.value==='dark'?'ag-theme-quartz-dark':'ag-theme-quartz'
        myStore.agGridthemeClass=configStore.theme==='system'?userTheme:configStore.theme==='dark'? 'ag-theme-quartz-dark':'ag-theme-quartz'
    })

    const rowDataIn=ref<any[]>([])
    const rowDataReturn=ref<any[]>([])
    const rowDataOut=ref<any[]>([])
    const loadings=ref<boolean[]>([])
    const currentTab=ref('In')

    // 👉 agGrid
    const gridApiIn=shallowRef<GridApi|null>(null)
    const gridApiReturn=shallowRef<GridApi|null>(null)
    const gridApiOut=shallowRef<GridApi|null>(null)

    const rowFooterIn=ref<any>()
    const rowFooterReturn=ref<any>()
    const rowFooterOut=ref<any>()

    const columnDefsIn=ref([
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
        {headerName:'Code',field:'code'},
        {
            headerName:'Date',field:'documentDate',
            cellDataType:'date',
            cellRenderer:(params:any)=>{
                return params.value?params.value.substr(0,10):null
            }
        },
        {headerName:'Supplier',field:'supplier'},
        {headerName:'PO',field:'poNo'},
        {headerName:'Receive No.',field:'documentNo'},
        {headerName:'Unit',field:'unit'},
        {
            headerName:'Schedule',field:'scheduleQty',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'Inventory',field:'qty',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'Price',field:'unitPrice',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'Currency',field:'currency'},
        {headerName:'Rate',field:'moneyRate',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {headerName:'Department',field:'department'},

    ])
    const columnDefsReturn=ref([
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
        {headerName:'Yarn ID', field:'yarnId'},
        {headerName:'Sample', field:'sample',cellClass:'d-flex justify-center'},
        {headerName:'Code',field:'code'},
        {
            headerName:'Return Date',field:'documentDate',
            cellDataType:'date',
            cellRenderer:(params:any)=>{
                return params.value?params.value.substr(0,10):null
            }
        },
        {headerName:'Lot No.',field:'lotNo'},
        {headerName:'Return No.',field:'documentNo'},
        {
            field:'carton',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            field:'weight',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
    ])
    const columnDefsOut=ref([
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
        {headerName:'Yarn ID', field:'yarnId'},
        {headerName:'Sample', field:'sample',cellClass:'d-flex justify-center'},
        {headerName:'Code',field:'code'},
        {
            headerName:'Issue Date',field:'documentDate',
            cellDataType:'date',
            cellRenderer:(params:any)=>{
                return params.value?params.value.substr(0,10):null
            }
        },
        {headerName:'Lot No.',field:'lotNo'},
        {headerName:'Issue No.',field:'documentNo'},
        {
            field:'carton',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            field:'weight',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
    ])

    const defaultColDef = ref<ColDef>({
      sortable: false,
      resizable:true,
      suppressHeaderMenuButton:true,
      width:100,
    })
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

    const onGridReadyIn=async (params:GridReadyEvent)=>{
        gridApiIn.value=params.api
        const {data,footer}=await $api<any>(`${import.meta.env.BASE_URL}api/yarn/getyarncostmodal?year=${props.monthYear?.substr(0,4)}&month=${props.monthYear?.substr(4,2)}&yarnId=${props.yarnId}&sample=${props.sample}&process=In`)
        rowDataIn.value=data
        rowFooterIn.value=[{
            totalRows:footer.totalRows,
            scheduleQty:footer.scheduleQty,
            qty:footer.qty,
        }]
        gridApiIn.value?.autoSizeAllColumns()
    }
    const onGridReadyReturn=async (params:GridReadyEvent)=>{
        gridApiReturn.value=params.api
        const {data,footer}=await $api<any>(`${import.meta.env.BASE_URL}api/yarn/getyarncostmodal?year=${props.monthYear?.substr(0,4)}&month=${props.monthYear?.substr(4,2)}&yarnId=${props.yarnId}&sample=${props.sample}&process=Return`)
        rowDataReturn.value=data
        rowFooterReturn.value=[{
            totalRows:footer.totalRows,
            carton:footer.carton,
            weight:footer.weight,
        }]
        gridApiReturn.value?.autoSizeAllColumns()
    }
    const onGridReadyOut=async (params:GridReadyEvent)=>{
        gridApiOut.value=params.api
        const {data,footer}=await $api<any>(`${import.meta.env.BASE_URL}api/yarn/getyarncostmodal?year=${props.monthYear?.substr(0,4)}&month=${props.monthYear?.substr(4,2)}&yarnId=${props.yarnId}&sample=${props.sample}&process=Out`)
        rowDataOut.value=data
        rowFooterOut.value=[{
            totalRows:footer.totalRows,
            carton:footer.carton,
            weight:footer.weight,
        }]
        gridApiOut.value?.autoSizeAllColumns()
    }

    defineExpose({
        VIconRenderer,
    })
</script>
<template>
    <v-dialog
        :width="$vuetify.display.smAndDown ? 'auto' : '80%'"
        v-model="isDialogVisible"
    >
        <DialogCloseBtn @click="isDialogVisible=false"/>
        <VCard height="80vh">
            <VCardTitle primary-title>
                <VRow>
                    <VCol cols="12">
                        Yarn ID: {{yarnId}}
                        <VChip v-if="sample" color="secondary"> Sample</VChip>
                    </VCol>
                </VRow>
            </VCardTitle>
            <VTabs v-model="currentTab">
                <VTab>In</VTab>
                <VTab>Return</VTab>
                <VTab>Out</VTab>
            </VTabs>
            <VCardText class="pa-1">
                <VWindow v-model="currentTab">
                    <VWindowItem value="In">
                        <div class="ag-wrapper">
                           <ag-grid-vue
                            id="inGrid"
                            @gridReady="onGridReadyIn"
                            :autoSizeStrategy="autoSizeStrategy"
                            :class=myStore.agGridthemeClass
                            :columnDefs="columnDefsIn"
                            :defaultColDef="defaultColDef"
                            :getRowStyle="getRowStyle"
                            :headerHeight="40"
                            :rowData="rowDataIn"
                            :row-height="35"
                            :pinnedBottomRowData="rowFooterIn"
                            :suppressColumnVirtualisation="true"
                            style="width: 100%;height: 100%;"
                        /> 
                        </div>
                    </VWindowItem>
                    <VWindowItem value="Return">
                        <div class="ag-wrapper">
                            <ag-grid-vue
                            id="returnGrid"
                            @gridReady="onGridReadyReturn"
                            :autoSizeStrategy="autoSizeStrategy"
                            :class=myStore.agGridthemeClass
                            :columnDefs="columnDefsReturn"
                            :defaultColDef="defaultColDef"
                            :getRowStyle="getRowStyle"
                            :headerHeight="40"
                            :rowData="rowDataReturn"
                            :row-height="35"
                            :pinnedBottomRowData="rowFooterReturn"
                            :suppressColumnVirtualisation="true"
                            style="width: 100%;height: 100%;"
                        />
                        </div>
                    </VWindowItem>
                    <VWindowItem value="Out">
                        <div class="ag-wrapper">
                            <ag-grid-vue
                            id="outGrid"
                            @gridReady="onGridReadyOut"
                            :autoSizeStrategy="autoSizeStrategy"
                            :class=myStore.agGridthemeClass
                            :columnDefs="columnDefsOut"
                            :defaultColDef="defaultColDef"
                            :getRowStyle="getRowStyle"
                            :headerHeight="40"
                            :rowData="rowDataOut"
                            :row-height="35"
                            :pinnedBottomRowData="rowFooterOut"
                            :suppressColumnVirtualisation="true"
                            style="width: 100%;height: 100%;"
                        />
                        </div>
                    </VWindowItem>
                </VWindow>
            </VCardText>
        </VCard>
    </v-dialog>
</template>
<style scoped>
    .v-window,.v-window-item,.ag-wrapper {
        height: 100%;
    }
</style>
