<script setup lang="ts">
import { outline } from '@/views/demos/components/pagination/demoCodePagination';

    const props=defineProps({
        message:String,
        color:String
    })
    const isVisible=defineModel<boolean>('isVisible')

</script>
<template>
    <VSnackbar
        v-model="isVisible"
        location="bottom end"
        transition="scroll-y-reverse-transition"
        :timeout="5000"
        style="z-index:3000 ;"
        

    >
        <VIcon 
            icon="tabler-alert-triangle-filled"
            size="22"
            :color="props.color"
        />        
        {{ message }}
    </VSnackbar>
</template>
