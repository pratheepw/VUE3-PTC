<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import YarnCheckDialog from './yarn-check-dialog.vue';

    const props=defineProps({params:Object})

    const isDialogVisible=ref(false)
    const docNo=ref(props.params?.data?.docNo)
    const yarnId=ref(props.params?.data?.yarnId)
    const status=ref(props.params?.data?.status)

</script>
<template>
    <router-link 
        v-if="docNo"
        to="#" 
        @click="isDialogVisible=true"
    >
        <VIcon
            :size="22"
            icon="tabler-list-search"
            color="primary"
        ></VIcon>
    </router-link>

    <YarnCheckDialog
        v-model:is-dialog-visible="isDialogVisible"
        :docNo="docNo"
        :yarnId="yarnId"
        :status="status"
    />
</template>
