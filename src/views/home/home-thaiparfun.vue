<script setup lang="ts">
    const router=useRouter()

    const EximData=[
        {
            title:'Export Invoice',
            to:'/thai-parfun/exim/export-invoice-tpf',
            props:{
                prependIcon:'tabler-lock',
                disabled:false
            },
        },
    ]

    const ThaiParfunData=[
        {
            title:'Exim',
            icon:'tabler-truck',
            listItem:EximData
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
        Thai Parfun
    </VAlert>
    <VRow>
        <VCol
            v-for="data in ThaiParfunData"
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
