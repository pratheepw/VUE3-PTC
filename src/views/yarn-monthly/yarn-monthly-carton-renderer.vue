<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import YarnMonthlyDialog from './yarn-monthly-dialog.vue';

    const props=defineProps({
        params:Object
    })
    const listOfValue=props.params?.values;

    const isDialogVisible=ref(false)
    const searchType=ref(listOfValue[0]?.label)
    const color=ref(listOfValue[0]?.color)
</script>
<template>
    <router-link 
        v-if="props.params?.value"
        to='/yarn-stock/yarn-monthly'
        @click.prevent="isDialogVisible=true"
        :style="{color:color}"
    >
        {{ props.params?.value==0? '' :new Intl.NumberFormat().format(props.params?.value) }}
    </router-link>

    <YarnMonthlyDialog
        v-model:is-dialog-visible="isDialogVisible"
        :dateSearch="props.params?.data?.dateSearch"
        :yarnId="props.params?.data?.yarnId"
        :searchType="searchType"
        :code="props.params?.data?.code"
    />
</template>
