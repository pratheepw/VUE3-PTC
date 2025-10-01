<script setup lang="ts">
import { title } from 'node:process'

    const router=useRouter()

    const accountData=[
        {
            title:'Cheque',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Inventory Aging',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Export Account',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Stock Management',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Stock Movement',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Received Amount by Delivery Date',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Estimation of Formula Fabric',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Stock by Week',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Lock PO',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
    ]

    const fabricData=[
        {
            title:'Fabric Dimension',
            to:'/fabric/fabric-dimension',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'Fabric Ingredient',
            to:'/fabric/fabric-ingredient',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'Fabric Standard',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Fabric Order Sheet',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Fabric Order Balance',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Yarn Test Report of BOKEN',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Fabric Price Check',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Lot Movement',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'PO Fabric',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Fabric Registration',
            to:'/fabric/fabric-registration',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'Fabric Order Movement',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Item Master',
            to:'/fabric/item-master',
            props:{
                prependIcon:'tabler-lock',
                disabled:false
            },
        }

    ]

    const YarnStockData=[
        {
            title:'Monthly Yarn',
            to:'/yarn-stock/yarn-monthly',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'Balance',
            to:'/yarn-stock/yarn-balance',
            props:{
                prependIcon:'tabler-point',
                disabled:false    
            },
        },
        {
            title:'Check In/Out/Return',
            to:'/yarn-stock/yarn-check',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'ใบสรุป',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Yarn Cost',
            to:'/yarn-stock/yarn-cost',
            props:{
                prependIcon:'tabler-lock',
                disabled:false
            },
        },
        {
            title:'Dead Stock',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Yarn Movement',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        
        
    ]

    const EximData=[
        {
            title:'Export Invoice',
            to:'/exim/export-invoice',
            props:{
                prependIcon:'tabler-lock',
                disabled:false
            },
        },
        {
            title:'Accessories Invoice',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Search by Export No.',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
    ]

    const GreigeFabricStockData=[
        {
            title:'Knit Schedule',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Check In',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Check Out',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Balance',
            to:'/greige-fabric/gf-balance',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'Yarn Consumption (Plan)',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Search Lot No.',
            to:'/greige-fabric/gf-search-lot',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'Delete Barcode',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Search Greige Fabric by Fabric',
            to:'/greige-fabric/gf-search-fabric',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'Greige Fabric Quality Data',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Estimation of Formula Greige Fabric',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Search Greige Fabric by Lot No.',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Monthly Griege Fabric',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'WIP',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
    ]

    const DyeingSectionData=[
        {
            title:'Dyeing Schedule',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Shrinkage',
            to:'/dyeing/shrinkage',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'Preparation Order',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Temperature and Humidity Control',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
    ]

    const HRData=[
        {
            title:'Summary Purchase Order',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Summary Receive',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Meeting Room Schedule',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
    ]

    const FinishFabricWIPData=[
        {
            title:'Dyeing Delivery Report',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Daily Delivery',
            to:'/fabric-wip/daily-delivery',
            props:{
                prependIcon:'tabler-point',
                disabled:false
            },
        },
        {
            title:'Daily Defect',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'ตรวจสอบผ้าสำเร็จรูป',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Stock Finish Fabric',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Finish Fabric Invoice Delivery',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Monthly Fabric',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
    ]

    const FinishFabricNCData=[
        {
            title:'Check In',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Check Out',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Balance',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Search Finish Fabric',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Stock Card',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'PTC Internal Testing',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
    ]

    const TPiCSData=[
    {
            title:'TPiCS Contract',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Unit Cost',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Inter Sale Order Balance',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Find Fabric Code',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Order Balance',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
    ]

    const SalesData=[
    {
            title:'Sale Report (Daily Sale Report)',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
    ]

    const ProductionData=[
        {
            title:'Production Daily Report by Qty,Amount',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Line Profit Report',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Sewing Loss Report',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'% Cutting - Sewing - Packing',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'Solution Activity',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
    ]

    const InterProductionData=[
        {
            title:'WIP Finished Goods Inter',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
        {
            title:'WIP Finished Goods Inter (Balance)',
            to:'',
            props:{
                prependIcon:'tabler-point',
                disabled:true
            },
        },
    ]
    
    const homeNakhonchaisriData = [
        {
            title: 'Account',
            icon:'tabler-cash-banknote',
            height:'612.391px',
            listItem:accountData
        },
        {
            title:'Fabric',
            icon:'tabler-shirt',
            height:'612.391px',
            listItem:fabricData
        },
        {
            title:'Greige Fabric Stock',
            icon: 'tabler-building-warehouse',
            height:'612.391px',
            listItem:GreigeFabricStockData
        },
        {
            title:'Exim',
            icon:'tabler-truck',
            height:'384.391px',
            listItem:EximData
        },
        {
            title:'Yarn Stock',
            icon:'tabler-needle-thread',
            height:'384.391px',
            listItem:YarnStockData
        },
        
        
        {
            title:'Dyeing Section',
            icon:'tabler-palette',
            height:'384.391px',
            listItem:DyeingSectionData
        },
        {
            title:'HR',
            icon:'tabler-users-group',
            height:'384.391px',
            listItem:HRData
        },
        {
            title:'Finish Fabric WIP',
            icon:'tabler-building-warehouse',
            height:'384.391px',
            listItem:FinishFabricWIPData
        },
        {
            title:'Finish Fabric NC',
            icon:'tabler-building-warehouse',
            height:'384.391px',
            listItem:FinishFabricNCData
        },
        {
            title:'TPiCS',
            icon:'tabler-brand-twitter',
            height:'308.391px',
            listItem:TPiCSData
        },
        {
            title:'Sales',
            icon:'tabler-user-dollar',
            height:'308.391px',
            listItem:SalesData
        },
        {
            title:'Production',
            icon:'tabler-asset',
            height:'308.391px',
            listItem:ProductionData
        },
        {
            title:'Inter | Production',
            icon:'tabler-building-warehouse',
            listItem:InterProductionData
        }
    ]

    const openLink=(item:any)=>{
        console.log(item)
        router.push(item)
    }
    

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
        <VCard :height="data.height" >
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
                >
                    <VListItem
                        v-for="item in data.listItem"
                        :key="item.title"
                        :to="item.to"
                        :disabled="item.props.disabled"
                        :title="item.title"
                        :prepend-icon="item.props.prependIcon"
                    >

                    </VListItem>
                </VList>
                    
            </VCardText>
        </VCard>
    </VCol>
  </VRow>

</template>
