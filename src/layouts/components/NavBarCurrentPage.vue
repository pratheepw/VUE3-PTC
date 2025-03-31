<script setup lang="ts">
import { useMyStore } from '@/stores/my';

    
    const myStore=useMyStore()
</script>
<template>
    <span class="text-h5">{{ myStore.currentPageTitle }}</span>
</template>
