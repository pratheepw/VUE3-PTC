<script setup lang="ts">
  import HomeNakhonchaisri from '@/views/home/home-nakhonchaisri.vue'
  import HomeSales1 from '@/views/home/home-sales1.vue'
  import HomeSales2 from '@/views/home/home-sales2.vue'
  import { useMyStore } from '@/stores/my'

  definePage({
      meta:{
          action:'read',
          subject:'home'
      }
  })

  // 👉 Set current page title
  const myStore=useMyStore()
  myStore.currentPageTitle=''


</script>

<template>
  <HomeNakhonchaisri/>
  <HomeSales1 />
  <HomeSales2 />
</template>
