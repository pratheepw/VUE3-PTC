<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import ExportInvoiceDialog from './export-invoice-dialog.vue';

    const props=defineProps({
        params:Object
    })

    const isDialogVisible=ref(false)
    const invoiceNo=ref(props.params?.data?.invoiceNo)
    const mark=ref(props.params?.data?.mark)
</script>
<template>
    <router-link 
        v-if="invoiceNo"
        to="/exim/export-invoice" 
        @click.prevent="isDialogVisible=true"
    >
        {{ invoiceNo }}
    </router-link>

    <ExportInvoiceDialog
        v-model:is-dialog-visible="isDialogVisible"
        :invoice-no="invoiceNo"
        :mark="mark"
    />
</template>
