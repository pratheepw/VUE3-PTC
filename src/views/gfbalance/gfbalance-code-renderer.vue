<script setup lang="ts">
    import { RouterLink } from 'vue-router';
    import GfbalanceDialog from './gfbalance-dialog.vue';

    const props=defineProps({params:Object})

    const isDialogVisible=ref(false)
    const code=ref(props.params?.data?.code)
    const section=ref(props.params?.data?.section)

</script>
<template>
    <router-link 
        v-if="code"
        to="#" 
        @click="isDialogVisible=true"
    >
        {{ code }}
    </router-link>

    <GfbalanceDialog
        v-model:is-dialog-visible="isDialogVisible"
        :code="code"
        :section="section"
    />
</template>
