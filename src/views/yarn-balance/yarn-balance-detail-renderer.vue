<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import yarnBalanceDialog from './yarn-balance-dialog.vue';

    const props=defineProps({params:Object})

    const isDialogVisible=ref(false)
    const yarnId=ref(props.params?.data?.yarnId)
    const code=ref(props.params?.data?.code)
    const supplier=ref(props.params?.data?.supplier)
    const lotNo=ref(props.params?.data?.lotNo)
    const section=ref(props.params?.data?.section)
    const sample=ref(props.params?.data?.sample)
    const status=ref(props.params?.data?.status)
    const dateSearch=ref(props.params?.data?.dateSearch)
    const location=ref(props.params?.data?.location)
    const customer=ref(props.params?.data?.customer)

</script>
<template>
    <router-link 
        v-if="yarnId"
        to="#" 
        @click="isDialogVisible=true"
    >
        <VIcon
            :size="22"
            icon="tabler-list-search"
            color="primary"
        ></VIcon>
    </router-link>

    <yarnBalanceDialog
        v-model:is-dialog-visible="isDialogVisible"
        :yarnId="yarnId"
        :code="code"
        :supplier="supplier"
        :lotNo="lotNo"
        :section="section"
        :sample="sample"
        :dateSearch="dateSearch"
        :location="location"
        :customer="customer"
        :status="status"
    />
</template>
