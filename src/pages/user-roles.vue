<script setup lang="ts">
  import userRolesCards from '@/views/user-roles/user-roles-cards.vue';

  definePage({
    meta:{
      action:'read',
      subject:'user-roles'
    }
  })
</script>

<template>
  <VRow>
    <VCol cols="12">
      <h4 class="text-h4 mb-1">
        Roles List
      </h4>
      <p class="text-body-1 mb-0">
        A role provided access to predefined menus and features so that depending on assigned role an administrator can have access to what he need
      </p>
    </VCol>

    <!-- 👉 Roles Cards -->
    <VCol cols="12">
      <userRolesCards/>
    </VCol>

  </VRow>
</template>
