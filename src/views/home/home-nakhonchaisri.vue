<script setup lang="ts">
import { rounded } from '../demos/components/avatar/demoCodeAvatar';
import { disabled } from '../demos/components/pagination/demoCodePagination';
import { prependIcon } from '../demos/forms/form-elements/file-input/demoCodeFileInput';

    const accountData=[
        {
            title:'Cheque',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Inventory Aging',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Export Account',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Stock Management',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Stock Movement',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Received Amount by Delivery Date',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Estimation of Formula Fabric',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Stock by Week',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Lock PO',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
    ]

    const fabricData=[
        {
            title:'Fabric Dimension',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Ingredient',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Standard',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Order Sheet',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Fabric Order Balance',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Yarn Test Report of BOKEN',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Price Check',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Lot Movement',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'PO Fabric',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Registration',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Order Movement',
            value:'',
            props:{
                disabled:true
            },
        },
    ]

    const YarnStockData=[
        {
            title:'Monthly Yarn',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Balance',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Check In/Out/Return',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'ใบสรุป',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Yarn Cost',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Dead Stock',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Yarn Movement',
            value:'',
            props:{
                disabled:true
            },
        },
        
        
    ]

    const EximData=[
        {
            title:'Export Invoice',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Accessories Invoice',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Search by Export No.',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
    ]

    const GreigeFabricStockData=[
        {
            title:'Knit Schedule',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Check In',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Check Out',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Balance',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Yarn Consumption (Plan)',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Search Lot No.',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Delete Barcode',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Search Grige Fabric by Fabric',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Greige Fabric Quality Data',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Estimation of Formula Greige Fabric',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Search Greige Fabric by Lot No.',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Monthly Griege Fabric',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'WIP',
            value:'',
            props:{
                disabled:true
            },
        },
    ]

    const DyeingSectionData=[
        {
            title:'Dyeing Schedule',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Shrinkage',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Preparation Order',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Temperature and Humidity Control',
            value:'',
            props:{
                disabled:true
            },
        },
    ]

    const HRData=[
        {
            title:'Summary Purchase Order',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Summary Receive',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Meeting Room Schedule',
            value:'',
            props:{
                disabled:true
            },
        },
    ]

    const FinishFabricWIPData=[
        {
            title:'Dyeing Delivery Report',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Daily Delivery',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Daily Defect',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'ตรวจสอบผ้าสำเร็จรูป',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Stock Finish Fabric',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Finish Fabric Invoice Delivery',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Monthly Fabric',
            value:'',
            props:{
                disabled:true
            },
        },
    ]

    const FinishFabricNCData=[
        {
            title:'Check In',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Check Out',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Balance',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Search Finish Fabric',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Stock Card',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'PTC Internal Testing',
            value:'',
            props:{
                disabled:true
            },
        },
    ]

    const TPiCSData=[
    {
            title:'TPiCS Contract',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Unit Cost',
            value:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Inter Sale Order Balance',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Find Fabric Code',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Order Balance',
            value:'',
            props:{
                disabled:true
            },
        },
    ]

    const SalesData=[
    {
            title:'Sale Report (Daily Sale Report)',
            value:'',
            props:{
                disabled:true
            },
        },
    ]

    const ProductionData=[
        {
            title:'Production Daily Report by Qty,Amount',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Line Profit Report',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Sewing Loss Report',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'% Cutting - Sewing - Packing',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Solution Activity',
            value:'',
            props:{
                disabled:true
            },
        },
    ]

    const InterProductionData=[
        {
            title:'WIP Finished Goods Inter',
            value:'',
            props:{
                disabled:true
            },
        },
        {
            title:'WIP Finished Goods Inter (Balance)',
            value:'',
            props:{
                disabled:true
            },
        },
    ]
    
    const homeNakhonchaisriData = [
        {
            title: 'Account',
            icon:'tabler-cash-banknote',
            listItem:accountData
        },
        {
            title:'Fabric',
            icon:'tabler-shirt',
            listItem:fabricData
        },
        {
            title:'Yarn Stock',
            icon:'tabler-needle-thread',
            listItem:YarnStockData
        },
        {
            title:'Exim',
            icon:'tabler-truck',
            listItem:EximData
        },
        {
            title:'Greige Fabric Stock',
            icon: 'tabler-building-warehouse',
            listItem:GreigeFabricStockData
        },
        {
            title:'Dyeing Section',
            icon:'tabler-palette',
            listItem:DyeingSectionData
        },
        {
            title:'HR',
            icon:'tabler-users-group',
            listItem:HRData
        },
        {
            title:'Finish Fabric WIP',
            icon:'tabler-building-warehouse',
            listItem:FinishFabricWIPData
        },
        {
            title:'Finish Fabric NC',
            icon:'tabler-building-warehouse',
            listItem:FinishFabricNCData
        },
        {
            title:'TPiCS',
            icon:'tabler-brand-twitter',
            listItem:TPiCSData
        },
        {
            title:'Sales',
            icon:'tabler-user-dollar',
            listItem:SalesData
        },
        {
            title:'Production',
            icon:'tabler-asset',
            listItem:ProductionData
        },
        {
            title:'Inter | Production',
            icon:'tabler-building-warehouse',
            listItem:InterProductionData
        }
    ]

    

</script>

<template>
  <VAlert
    icon="tabler-building-factory-2"
    color="success"
    border="start"
    variant="tonal"
    class="mb-4 text-h5"
  >
    Nakonchaisri
  </VAlert>
  <VRow>
    <VCol
        v-for="data in homeNakhonchaisriData"
        :key="data.icon"
        cols="12"
        sm="6"
        md="4"
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
