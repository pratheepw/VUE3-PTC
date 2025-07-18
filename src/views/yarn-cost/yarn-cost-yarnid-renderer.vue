<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import YarnCostDialog from './yarn-cost-dialog.vue';

    const props=defineProps({
        params:Object
    })

    const isDialogVisible=ref(false)
    const monthYear=ref(props.params?.data?.monthYear)
    const yarnId=ref(props.params?.data?.yarnId)
    const sample=ref(props.params?.data?.sample)

</script>
<template>
    <router-link 
        v-if="yarnId"
        to="/yarn-stock/yarn-cost" 
        @click.prevent="isDialogVisible=true"
    >
        {{ yarnId }}
    </router-link>

    <YarnCostDialog
        v-model:is-dialog-visible="isDialogVisible"
        :monthYear="monthYear"
        :yarnId="yarnId"
        :sample="sample"
    />
</template>
