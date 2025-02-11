<script setup lang="ts">
    import AgGrid from '@/components/ag-grid/AgGrid.vue';

    definePage({
        meta:{
            action:'read',
            subject:'gfsearchlot'
        }
    })

    const ddlType=ref('Lot No')
    const txtSearch=ref('')
    const rowData=ref([])
    const rowFooter=ref({})
    const loadings=ref<boolean[]>([])

    // 👉 Fetching data
    const fetchData=async(exportExcel:boolean)=>{
        try {
            if(exportExcel){
                loadings.value[1]=true
                const res = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfsearchlot?ddlType=${ddlType.value}&txtSearch=${txtSearch.value}&exportExcel=${exportExcel}`)
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
            }else{
                loadings.value[0]=true
                const {data,footer} = await $api<any>(`${import.meta.env.BASE_URL}api/fabric/getgfsearchlot?ddlType=${ddlType.value}&txtSearch=${txtSearch.value}&exportExcel=${exportExcel}`)
                rowData.value=data
                rowFooter.value=footer
                loadings.value[0]=false
            }
            
        } catch (error) {
            loadings.value[0]=false
            loadings.value[1]=false
            console.log(error)
        }
        
    }
    

    // 👉 agGrid
    const columnDefs=ref([
        {headerName:'Issue No.',field:'issue'},
        {
            headerName:'Date',field:'outDate',
            cellDataType:'date',
            cellRenderer:(params:any)=>{
                return params.value? params.value.substr(0,10):null
            }
        },
        {headerName:'Lot No.', field:'lotNo'},
        {field:'code'},
        {headerName:'Piece No.', field:'pieceNo'},
        {
            field:'weight',
            cellDataType:'number',type:'rightAligned',
        },
        {field:'color'},
        {headerName:'Order No.', field:'fabOrderNo'},
        {
            headerName:'1', field:'k1',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'2', field:'k2',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'3', field:'k3',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'4', field:'k4',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'5', field:'k5',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'6', field:'k6',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'7', field:'k7',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'8', field:'k8',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'9', field:'k9',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'10', field:'k10',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            headerName:'11', field:'k11',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
        },
        {
            field:'iso',
            cellDataType:'number',type:'rightAligned',
            cellRenderer:(params:any)=>params.value===0?'':params.value,
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
</script>
<template>
    <VCard>
        <VCardText class="px-2 py-2">
            <VRow class="my-1">
                <VCol cols="12" md="6" lg="2">
                    <VSelect
                        v-model="ddlType"
                        :items="['Lot No','Fabric Order No']"
                        label="Search by"
                        density="compact"
                    />
                </VCol>
                <VCol cols="12" md="6" lg="2">
                    <AppTextField
                        id="txtSearch"
                        v-model="txtSearch"
                        density="compact"
                    />
                </VCol>
                <VCol cols="12" md="6" lg="3">
                    <VBtn
                        size="small"
                        color="primary"
                        :loading="loadings[0]"
                        :disabled="loadings[0]"
                        @click="fetchData(false)"
                    >
                        <VIcon start icon="tabler-search"/>    
                    Search
                    </VBtn>
                    <VBtn
                        size="small"
                        color="success"
                        class="ms-1"
                        :loading="loadings[1]"
                        :disabled="loadings[1]"
                        @click="fetchData(true)"
                    >
                        <VIcon start icon="tabler-file-spreadsheet"/>    
                    Export
                    </VBtn>
                </VCol>
                <VCol 
                    cols="12" md="6" lg="2"
                    class=" ms-auto d-flex justify-end"
                >
                    <VChip 
                        v-if="rowFooter.totalRows"
                        color="#E91E63"
                    >
                        {{ rowFooter.totalRows}} rows
                    </VChip>
                </VCol>
            </VRow>
            <AgGrid
                :columnDefs="columnDefs"
                :rowData="rowData"
                :row-height="35"
                :pinned-bottom-row-data="[{
                    weight:rowFooter.weight,
                    k1:rowFooter.k1,
                    k2:rowFooter.k2,
                    k3:rowFooter.k3,
                    k4:rowFooter.k4,
                    k5:rowFooter.k5,
                    k6:rowFooter.k6,
                    k7:rowFooter.k7,
                    k8:rowFooter.k8,
                    k9:rowFooter.k9,
                    k10:rowFooter.k10,
                    k11:rowFooter.k11,
                    iso:rowFooter.iso
                }]"
                style="height: 450px;"
            />
        </VCardText>
         
        
    </VCard>
</template>

