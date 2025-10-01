<script setup lang="ts">
    const packingData=[
        {
            title:'Packing Daily',
            value:'',
            props:{
                disabled:true
            }
        },
        {
            title:'Packing CheckIn',
            value:'',
            props:{
                disabled:true
            }
        },
    ]

    const warehouseData=[
        {
            title:'Check In',
            value:'',
            props:{
                disabled:true
            }
        },
        {
            title:'Check Out',
            value:'',
            props:{
                disabled:true
            }
        },
        {
            title:'Monthly Warehouse',
            value:'',
            props:{
                disabled:true
            }
        },
    ]

    const StoreData=[
        {
            title:'Monthly Accessory',
            value:'',
            props:{
                disabled:true
            }
        },
        {
            title:'Age Accessory',
            value:'',
            props:{
                disabled:true
            }
        },
        {
            title:'In & Out Accessory',
            value:'',
            props:{
                disabled:true
            }
        },
    ]

    const SalesData=[
        {
            title:'Packing Sales 1',
            icon:'tabler-building-warehouse',
            listItem:packingData
        },
        {
            title:'Warehouse Sales 1',
            icon:'tabler-building-warehouse',
            listItem:warehouseData
        },
        {
            title:'Store Sales 1',
            icon:'tabler-building-warehouse',
            listItem:StoreData
        }
    ]
</script>

<template>
    <VAlert
        icon="tabler-building-factory-2"
        color="success"
        border="start"
        variant="tonal"
        class="my-4 text-h5"
    >
        Sales1
    </VAlert>
    <VRow>
        <VCol
            v-for="data in SalesData"
            :key="data.title"
            cols="12"
            md="6"
            lg="4"
        >
            <VCard>
                <VCardItem>
                    <template #prepend>
                        <VIcon
                            size="1.9rem"
                            :icon="data.icon"
                        />
                    </template>
                    <VCardTitle>
                        {{ data.title }}
                    </VCardTitle>
                </VCardItem>
                <VCardText>
                    <VList 
                        density="compact"
                        :items="data.listItem"
                        
                    />
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>
