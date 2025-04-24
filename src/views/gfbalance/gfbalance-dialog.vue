<script setup lang="ts">
    import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
    import { AgGridVue } from 'ag-grid-vue3';
    import {ColDef,GridApi,GridReadyEvent,SizeColumnsToFitGridStrategy,SizeColumnsToFitProvidedWidthStrategy,SizeColumnsToContentStrategy} from 'ag-grid-community'
    
    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'

    const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
    const props=defineProps({
        code:String,
        section:String
    })

    // 👉 Set agGrid theme
    const myStore = useMyStore()
    const configStore=useConfigStore()
    watch(()=>configStore.theme,(newValue,oldValue)=>{
        const userPreferredColorScheme = usePreferredColorScheme()
        const userTheme=userPreferredColorScheme.value==='dark'?'ag-theme-quartz-dark':'ag-theme-quartz'
        myStore.agGridthemeClass=configStore.theme==='system'?userTheme:configStore.theme==='dark'? 'ag-theme-quartz-dark':'ag-theme-quartz'
    })

    const rowData=ref<any[]>([])
    const loadings=ref<boolean[]>([])

    // 👉 agGrid
    const gridApi=shallowRef<GridApi|null>(null)
    const rowFooter=ref<any>()

    const columnDefs=ref([
        {
            field:'prodDate',maxWidth:143,
            cellDataType:'date',
            cellRenderer:(params:any)=>{
                return params.value?params.value.substr(0,16).replace('T',' '):null
            }
        },
        {field:'code',hide:true},
        {field:'lotNo'},
        {field:'pieceNo'},
        {headerName:'M/C',field:'machineNo'},
        {
            field:'weight',type:'rightAligned',
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
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
        {field:'section',hide:true},
        {field:'grade',cellClass:'text-center'},
        {headerName:'Employee',field:'empId'},
        {
            headerName:'รูกลม (Round Hole)',field:'knitCircle',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'รูรี (Oval Hole)',field:'knitOval',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'เข็มหัก (Broken Needle)',field:'knitBrokeNeedle',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'รอยเกี่ยวผ้า (Scratch)',field:'knitHook',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'รอยฟันหนู (Fabric Stain)',field:'knitBad',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'ฝุ่น (Dust)',field:'dust',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'รอยสปันขาด (Dirty Machine)',field:'knitDirtyMachine',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'เปื้อน (Dirty)',field:'knitDirty',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'เป็นเม็ดกับ เศษด้ายปน',field:'knitHorizontal',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'ต่อปลาย (Ending Joint)',field:'knitConnectEnd',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
            cellRenderer:(params:any)=>{
                return (isNaN(params.value)|| params.value===0)?'': new Intl.NumberFormat().format(params.value)
            },
        },
        {
            headerName:'ตามด (Knit Hole)',field:'knitHole',type:'rightAligned',
            headerClass:'rotate-text',wrapHeaderText:true,autoHeaderHeight:true,
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
        const {data,footer}=await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfbalancemodal?code=${props.code}&section=${props.section}&exportExcel=false`)
        rowData.value=data
        rowFooter.value=[{
            weight:footer.weight,
            totalRows:footer.totalRows,
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
        gridApi.value?.autoSizeAllColumns()
    }
    
    const exportExcel=async()=>{
        try {
            loadings.value[0]=true
            const res = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfbalancemodal?code=${props.code}&section=${props.section}&exportExcel=true`)
            const url=window.URL.createObjectURL(res)
            const link=document.createElement('a')
            link.href=url
            link.setAttribute('download','gfbalancemodal.xlsx')
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

</script>
<template>
    <v-dialog
        :width="$vuetify.display.smAndDown ? 'auto' : '80%'"
        v-model="isDialogVisible"
    >
        <DialogCloseBtn @click="isDialogVisible=false"/>
        <v-card height="80vh">
            <v-card-title primary-title>
                <VRow>
                    <VCol cols="6">
                        {{ props.code}} : {{ props.section }}
                        <VBtn
                            size="small"
                            color="success"
                            class="ms-2"
                            variant="outlined"
                            :loading="loadings[0]"
                            :disabled="loadings[0]"
                            @click="exportExcel()"
                        >
                            <VIcon start icon="tabler-file-excel"/>
                            Export Excel
                        </VBtn>
                    </VCol>
                    <VCol cols="6" class="d-flex justify-end ms-auto">
                        <VChip
                            v-if="rowFooter"
                            color="#E91E63"
                        >
                            {{ new Intl.NumberFormat().format(rowFooter[0].totalRows) }} rows
                        </VChip>
                        <VChip
                            v-else
                            color="#E91E63">
                            0 rows
                        </VChip>
                    </VCol>
                </VRow>
            </v-card-title>
            <VCardText class="pa-1">
                <ag-grid-vue
                    id="myGrid"
                    @gridReady="onGridReady"
                    :autoSizeStrategy="autoSizeStrategy"
                    :class=myStore.agGridthemeClass
                    :columnDefs="columnDefs"
                    :defaultColDef="defaultColDef"
                    :getRowStyle="getRowStyle"
                    :headerHeight="130"
                    :rowData="rowData"
                    :row-height="35"
                    :pinnedBottomRowData="rowFooter"
                    :suppressColumnVirtualisation="true"
                    style="width: 100%;height: 100%;"
                />
            </VCardText>
        </v-card>
    </v-dialog>
</template>
