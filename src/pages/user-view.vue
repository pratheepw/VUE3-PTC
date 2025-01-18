<script setup lang="ts">
  import UserBioPanel from '@/views/user-view/user-view-bio-panel.vue'
  import UserTabAccount from '@/views/user-view/user-view-tab-account.vue'

  interface UserData {
    userId: string
    employeeId: string
    firstName: string
    lastName: string
    gender: string
    active:boolean
    position: string
    department: string
    email: string
    emailConfirmed:boolean
    photo:string
    fileBase64:string
    roles: Array<string>
  }

  const route = useRoute()
  const userTab = ref(null)

  const tabs = [
    { icon: 'tabler-users', title: 'Account' },
  ]
  console.log(route.query)
  const response  = await $api<any>(`${import.meta.env.BASE_URL}api/user/getuserprofile?userId=${route.query.userId}`)
  const userData=response

</script>

<template>
  <VRow v-if="userData">
    <VCol
      cols="12"
      md="5"
      lg="4"
    >
      <UserBioPanel v-model:userData="userData"  />
    </VCol>

    <VCol
      cols="12"
      md="7"
      lg="8"
    >
      <VTabs
        v-model="userTab"
        class="v-tabs-pill"
      >
        <VTab
          v-for="tab in tabs"
          :key="tab.icon"
        >
          <VIcon
            :size="18"
            :icon="tab.icon"
            class="me-1"
          />
          <span>{{ tab.title }}</span>
        </VTab>
      </VTabs>

      <VWindow
        v-model="userTab"
        class="mt-6 disable-tab-transition"
        :touch="false"
      >
        <VWindowItem>
          <UserTabAccount />
        </VWindowItem>

      </VWindow>
    </VCol>
  </VRow>
  <div v-else>
    <VAlert
      type="error"
      variant="tonal"
    >
      User with ID  {{ route.query.userId }} not found!
    </VAlert>
  </div>
</template>
