<script setup lang="ts">
  import HomeNakhonchaisri from '@/views/home/home-nakhonchaisri.vue'
  import HomeSales1 from '@/views/home/home-sales1.vue'
  import HomeSales2 from '@/views/home/home-sales2.vue'

  definePage({
      meta:{
          action:'read',
          subject:'home'
      }
  })


</script>

<template>
  <HomeNakhonchaisri/>
  <HomeSales1 />
  <HomeSales2 />

</template>
