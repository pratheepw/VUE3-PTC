<script setup lang="ts">
  import UserViewEditDialog from './user-view-edit-dialog.vue'
  import UserViewAvatarEditDialog from './user-view-avatar-edit-dialog.vue'

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

  const props=defineProps({userData:Object})
  const userData = ref<UserData>(props.userData)
    
  const isUserInfoEditDialogVisible = ref(false)
  const showDialog=(e:boolean)=>{
    isUserInfoEditDialogVisible.value=e
  }

  const isAvatarEditDialogVisible=ref(false)
  const showAvatarEditDialog=(e:boolean)=>{
    isAvatarEditDialogVisible.value=e
  }
  



  // 👉 Role variant resolver
  const resolveUserRoleVariant = (role: string) => {
    if (role.toLowerCase() === 'admin')
      return { color: 'primary', icon: 'tabler-device-desktop' }
    else if (role.toLowerCase() === 'client')
      return { color: 'success', icon: 'tabler-user' }
    else if (role.toLowerCase() === 'manager')
      return { color: 'error', icon: 'tabler-crown' }
    else
      return { color: 'secondary', icon: 'tabler-question-mark' }
  }

</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="userData">
        <VCardText class="text-center pt-12">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded
            :size="100"
            :color="userData.photo==='nopic.png' ? 'primary' : undefined"
            :variant="userData.photo==='nopic.png' ? 'tonal' : undefined"
          >
            <VImg
              v-if="userData.fileBase64"
              :src="userData.fileBase64"
            />
            <span 
              v-else
              class="text-5xl font-weight-medium"
            >
              {{ avatarText(`${userData.firstName} ${userData.lastName}`) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h5 class="text-h5 mt-4">
            {{ userData.firstName }} {{ userData.lastName }}
          </h5>

          <!-- 👉 Role chip -->
          <VChip
            v-for="role in userData.roles"
            label
            :color="resolveUserRoleVariant(role).color"
            size="small"
            class="text-capitalize mt-4 me-1"
          >
            <VIcon :icon="resolveUserRoleVariant(role).icon"/>
            {{ role }}
          </VChip>
        </VCardText>

        <VCardText>
          <!-- 👉 Details -->
          <h5 class="text-h5">
            Details
          </h5>

          <VDivider class="my-4" />

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Name:
                  <div class="d-inline-block text-body-1 text-capitalize">
                    {{ userData.firstName }} {{userData.lastName  }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <span class="text-h6">
                  Email:
                </span>
                <span class="text-body-1">
                  {{ userData.email }}
                </span>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Employee Id:
                  <div class="d-inline-block text-body-1">
                    {{ userData.employeeId }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Gender:
                  <div class="d-inline-block text-body-1 text-capitalize">
                    {{ userData.gender==='M'?'male':userData.gender==='F'?'female':userData.gender }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Position:
                  <div class="d-inline-block text-body-1 text-capitalize">
                    {{ userData.position }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Department:
                  <div class="d-inline-block text-body-1 text-capitalize">
                    {{ userData.department }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Email Verified:
                  <div class="d-inline-block text-body-1 text-capitalize">
                    {{ userData.emailConfirmed?'verified':'pending' }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Status:
                  <div class="d-inline-block text-body-1 text-capitalize">
                    {{ userData.active?'active':'inactive' }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  Role:
                  <div class="d-inline-block text-capitalize text-body-1">
                    {{ userData.roles }}
                  </div>
                </h6>
              </VListItemTitle>
            </VListItem>

          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center gap-x-4">
          <VBtn
            color="primary"
            variant="elevated"
            @click="showDialog(true)"
          >
            Edit
          </VBtn>
          <VBtn
            color="primary"
            variant="tonal"
            @click="showAvatarEditDialog(true)"
          >
            Change Avatar
          </VBtn>

        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->

  </VRow>

  <!-- 👉 Edit user info dialog -->
  <UserViewEditDialog
    v-model:isDialogVisible="isUserInfoEditDialogVisible"
    v-model:userData="userData"
  />
  <UserViewAvatarEditDialog
    v-model:isDialogVisible="isAvatarEditDialogVisible"
    v-model:userData="userData"
  />

  

</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.5rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}
</style>
