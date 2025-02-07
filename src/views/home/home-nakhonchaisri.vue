<script setup lang="ts">
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
                disabled:true
            },
        },
        {
            title:'Export Account',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Stock Management',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Stock Movement',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Received Amount by Delivery Date',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Estimation of Formula Fabric',
            to:'',
            props:{
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
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Ingredient',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Standard',
            to:'',
            props:{
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
                disabled:true
            },
        },
        {
            title:'Yarn Test Report of BOKEN',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Price Check',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Lot Movement',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'PO Fabric',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Fabric Registration',
            to:'/fabric/fabric-registration',
            props:{
                prependIcon:'tabler-arrow-badge-right',
                disabled:false
            },
        },
        {
            title:'Fabric Order Movement',
            to:'',
            props:{
                disabled:true
            },
        },
    ]

    const YarnStockData=[
        {
            title:'Monthly Yarn',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Balance',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Check In/Out/Return',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'ใบสรุป',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Yarn Cost',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
            },
        },
        {
            title:'Dead Stock',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Yarn Movement',
            to:'',
            props:{
                disabled:true
            },
        },
        
        
    ]

    const EximData=[
        {
            title:'Export Invoice',
            to:'',
            props:{
                prependIcon:'tabler-lock',
                disabled:true
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
                disabled:true
            },
        },
        {
            title:'Check In',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Check Out',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Balance',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Yarn Consumption (Plan)',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Search Lot No.',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Delete Barcode',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Search Grige Fabric by Fabric',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Greige Fabric Quality Data',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Estimation of Formula Greige Fabric',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Search Greige Fabric by Lot No.',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Monthly Griege Fabric',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'WIP',
            to:'',
            props:{
                disabled:true
            },
        },
    ]

    const DyeingSectionData=[
        {
            title:'Dyeing Schedule',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Shrinkage',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Preparation Order',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Temperature and Humidity Control',
            to:'',
            props:{
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
                disabled:true
            },
        },
    ]

    const FinishFabricWIPData=[
        {
            title:'Dyeing Delivery Report',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Daily Delivery',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Daily Defect',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'ตรวจสอบผ้าสำเร็จรูป',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Stock Finish Fabric',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Finish Fabric Invoice Delivery',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Monthly Fabric',
            to:'',
            props:{
                disabled:true
            },
        },
    ]

    const FinishFabricNCData=[
        {
            title:'Check In',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Check Out',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Balance',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Search Finish Fabric',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Stock Card',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'PTC Internal Testing',
            to:'',
            props:{
                disabled:true
            },
        },
    ]

    const TPiCSData=[
    {
            title:'TPiCS Contract',
            to:'',
            props:{
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
                disabled:true
            },
        },
        {
            title:'Find Fabric Code',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Order Balance',
            to:'',
            props:{
                disabled:true
            },
        },
    ]

    const SalesData=[
    {
            title:'Sale Report (Daily Sale Report)',
            to:'',
            props:{
                disabled:true
            },
        },
    ]

    const ProductionData=[
        {
            title:'Production Daily Report by Qty,Amount',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Line Profit Report',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Sewing Loss Report',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'% Cutting - Sewing - Packing',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'Solution Activity',
            to:'',
            props:{
                disabled:true
            },
        },
    ]

    const InterProductionData=[
        {
            title:'WIP Finished Goods Inter',
            to:'',
            props:{
                disabled:true
            },
        },
        {
            title:'WIP Finished Goods Inter (Balance)',
            to:'',
            props:{
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

    const openLink=(item)=>{
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
                    :items="data.listItem"
                    @click="router.push('/fabric/fabric-registration')"
                />
            </VCardText>
        </VCard>
    </VCol>
  </VRow>

</template>
