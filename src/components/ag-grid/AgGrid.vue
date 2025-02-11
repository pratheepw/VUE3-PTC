<script setup lang="ts">
    import { AgGridVue } from 'ag-grid-vue3'
    import {GridApi,ColDef,GridReadyEvent} from 'ag-grid-community'

    import { useConfigStore } from '@core/stores/config'
    import { useMyStore } from '@/stores/my'

    const gridApi=shallowRef<GridApi|null>(null) 
    const columnDefs=defineModel<ColDef[]>('columnDefs')
    const rowData=defineModel<any[]|null>('rowData')
    const autoSizeStrategy = ref({})
    const pinnedBottomRowData=defineModel<any[]>('pinnedBottomRowData')
    
    const props=defineProps({
        rowHeight:Number
    })

    // 👉 Set agGrid theme
    const myStore = useMyStore()
    const configStore=useConfigStore()
    watch(()=>configStore.theme,(newValue,oldValue)=>{
        const userPreferredColorScheme = usePreferredColorScheme()
        const userTheme=userPreferredColorScheme.value==='dark'?'ag-theme-quartz-dark':'ag-theme-quartz'
        myStore.agGridthemeClass=configStore.theme==='system'?userTheme:configStore.theme==='dark'? 'ag-theme-quartz-dark':'ag-theme-quartz'
    })

    onBeforeMount(() => {
        autoSizeStrategy.value = {
            type: "fitCellContents",
        };
    });

    const onGridReady=(params:GridReadyEvent)=>{
        gridApi.value=params.api

    }


        

</script>
    
<template>
    <AgGridVue
        :columnDefs="columnDefs"
        :rowData="rowData"
        :autoSizeStrategy="autoSizeStrategy"
        :class=myStore.agGridthemeClass
        :row-height="props.rowHeight"
        :suppressColumnVirtualisation="true"
        :pinnedBottomRowData="pinnedBottomRowData"
        @grid-ready="onGridReady"

    />
</template>
