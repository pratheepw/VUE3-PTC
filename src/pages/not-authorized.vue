<script setup lang="ts">

  definePage({
    // alias: '/pages/misc/not-authorized',
    meta: {
      layout: 'blank',
      public: true,
    },
  })

</script>

<template>
  <div class="misc-wrapper">
    <ErrorHeader
      status-code="401"
      title="You are not authorized! 🔐"
      description="You don’t have permission to access this page. Go Home!."
    />

    <VBtn
      class="mb-11"
      to="/home"
    >
      Back To Home
    </VBtn>

    
  </div>
</template>

<style lang="scss">
  @use "@core/scss/template/pages/misc.scss";
</style>
