<script setup lang="ts">
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
        variant="flat"
        :color="props.color"
    >
        
    {{ message }}
        
        
    </VSnackbar>
</template>
