<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import YarnMonthlyDetailDialog from './yarn-monthly-detail-dialog.vue';

    const props=defineProps({params:Object})

    const isDialogVisible=ref(false)
    const searchType=ref(props.params?.data?.searchType)
    const documentNo=ref(props.params?.data?.documentNo)
    const yarnId=ref(props.params?.data?.yarnId)
    const lotNo=ref(props.params?.data?.lotNo)
</script>
<template>
    <router-link 
        v-if="documentNo"
        to='/yarn-stock/yarn-monthly'
        @click.prevent="isDialogVisible=true"
    >
        <VIcon
            :size="22"
            icon="tabler-list-search"
            color="primary"
        ></VIcon>
    </router-link>

    <YarnMonthlyDetailDialog
        v-model:is-dialog-visible="isDialogVisible"
        :searchType="searchType"
        :documentNo="documentNo"
        :yarnId="yarnId"
        :lotNo="lotNo"
    />
</template>
