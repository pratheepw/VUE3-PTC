<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import DailyDeliveryDialog from './daily-delivery-dialog.vue';

    const props=defineProps({params:Object})

    const isDialogVisible=ref(false)
    const sysDate=ref(props.params?.data?.time)
    const fabricCode=ref(props.params?.data?.fabricCode)
    const lotNo=ref(props.params?.data?.lotNo)
    const color=ref(props.params?.data?.color)
    const fabOrderNo=ref(props.params?.data?.fabOrderNo)

</script>
<template>
    <router-link 
        v-if="fabricCode"
        to="#" 
        @click="isDialogVisible=true"
    >
        {{ fabricCode }}
    </router-link>

    <DailyDeliveryDialog
        v-model:is-dialog-visible="isDialogVisible"
        :sysDate="sysDate"
        :fabricCode="fabricCode"
        :lotNo="lotNo"
        :color="color"
        :fabOrderNo="fabOrderNo"
    />
</template>
