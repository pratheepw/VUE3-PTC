<script setup lang="ts">
  import UserPhoto from '@/components/UserPhoto.vue';
  import UserRolesAddUserDialog from './user-roles-add-user-dialog.vue';
  import UserRolesEditRoleDialog from './user-roles-edit-role-dialog.vue';
    
  interface Role{
    roleId:string
    roleName:string
    users:UserData[]
  }
 
  interface UserData{
    userId:string
    firstName:string
    lastName:string
    email:string
    photo:string

    fullName:string
    imagePath:string
  }

  const currentRole=ref<Role>()
  const roles=ref<Role[]>()
  const roleWithUsers=async()=>{
    const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/getroleswithusers`)
    roles.value=res
  }

  //<!-- 👉 Edit Role -->
  const isRoleDialogVisible = ref(false)
  const editRolePermission=(r:Role)=>{
    isRoleDialogVisible.value=true
    currentRole.value=r
  }
  
  //<!-- 👉 Add User to Role -->
  const isAddUserDialogVisible=ref(false)
  const editRoleUser=async (r:Role)=>{
    currentRole.value=r
    isAddUserDialogVisible.value=true
  }

  //<!-- 👉 Add New Role -->
  const addNewRole= async()=>{
    const result=prompt('Please input new role.')
    if(result!=null){
      try {
        const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/createrole`,{
          method:'POST',
          body:{
            name:result
          },
          onResponseError({response}){
            snackbar.visible=true
            snackbar.message=response._data.message
            snackbar.color='error'
          }
        })

        roleWithUsers()

        snackbar.visible=true
        snackbar.message='Add new role complete.'
        snackbar.color='success'

      } catch (error) {
        console.log(error)
      }
  
    }  
      
  }

  //<!-- 👉 Delete Role -->
  const deleteRole=async (r:Role)=>{
    const result=confirm(`Are you sure you want to delete ${r.roleName} role?`)
    if(result){
      try {
        const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/deleterole`,{
          method:'DELETE',
          body:{
            name:r.roleName
          },
          onResponseError({response}){
            snackbar.visible=true
            snackbar.message=response._data.message
            snackbar.color='error'
          }
        })

        roleWithUsers()

        snackbar.visible=true
        snackbar.message='Delete role complete.'
        snackbar.color='success'

      } catch (error) {
        console.log(error)
      }
    }
  }

  //<!-- 👉 Snackbar -->
  interface SnackbarType{
    visible:boolean
    message:any
    color:string
  }
  const snackbar=reactive<SnackbarType>({
      visible:false,
      message:undefined,
      color:''
  })

  onMounted(()=>{
    roleWithUsers()
  })
</script>

<template>
  <VRow>
    <!-- 👉 Roles -->
    <VCol
      v-for="item in roles"
      :key="item.roleId"
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard>
        <VCardText class="d-flex align-center pa-3">
          <div class="text-body-1">
            Total {{ item.users.length }} users
          </div>

          <VSpacer />

          <div class="v-avatar-group">
            <template
              v-for="(e, index) in item.users"
              :key="e.userId"
              >
              <VAvatar 
                v-if=" index < 3" 
                size="40"
                variant="tonal"
                color="primary"
              >
                <UserPhoto 
                  :photo="e.photo" 
                  :firstName="e.firstName" 
                  :lastName="e.lastName"
                  class="text-md font-weight-medium"
                />
              </VAvatar>
              <VAvatar 
                v-if=" index ===3 && item.users.length===4" 
                size="40"
                variant="tonal"
                color="primary"
              >
                <UserPhoto 
                  :photo="e.photo" 
                  :firstName="e.firstName" 
                  :lastName="e.lastName"
                  class="text-md font-weight-medium"
                />
              </VAvatar>

            </template>
            <VAvatar
              v-if="item.users.length > 4"
              :color="$vuetify.theme.current.dark ? '#373B50' : '#EEEDF0'"
            >
              <span>
                +{{ item.users.length - 3 }}
              </span>
            </VAvatar>
          </div>
        </VCardText>

        <VCardText class="pa-3">
          <div class="d-flex justify-space-between align-center">
            <div>
              <h5 class="text-h5 text-capitalize">
                {{ item.roleName }}
              </h5>
              <div class="d-flex align-center">
                <a
                  href="javascript:void(0)"
                  @click="editRolePermission(item)"
                >
                  Edit Role
                </a>
                <a
                  v-if="item.roleName !== 'admin'"
                  href="javascript:void(0)"
                  @click="deleteRole(item)"
                  class="text-secondary ms-3"
                >
                  Delete Role
                </a>
              </div>
            </div>
            
            <VTooltip location="top" text="Add User to Role">
              <template v-slot:activator="{props}">
                <VBtn
                  variant="tonal"
                  icon="tabler-user-plus"
                  class="text-high-emphasis"
                  @click="editRoleUser(item)"
                  v-bind="props"
                />
              </template>
            </VTooltip>
            
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- 👉 Add New Role -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
    >
      <VCard
        class="h-100"
        :ripple="false"
      >
        <VRow
          no-gutters
          class="h-100"
        >
          <VCol
            cols="5"
            class="d-flex flex-column justify-end align-center"
          >
            <VIcon
              size="100"
              icon="tabler-users-plus"
              color="#E0E0E0"
            />
          </VCol>

          <VCol cols="7">
            <VCardText class="d-flex flex-column align-end justify-end gap-3 pa-3">
              <VBtn
                size="small"
                @click="addNewRole()"
              >
                Add New Role
              </VBtn>
              <div class="text-end">
                Add new role,<br> if it doesn't exist.
              </div>
            </VCardText>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
  </VRow>

  <UserRolesEditRoleDialog
    v-model:is-dialog-visible="isRoleDialogVisible"
    :role-name="currentRole?.roleName"
  />
  <UserRolesAddUserDialog
    v-model:is-dialog-visible="isAddUserDialogVisible"
    v-model:current-role="currentRole"
  /> 
  <SnackbarAlert
    v-model:is-visible="snackbar.visible"
    :message="snackbar.message"
    :color="snackbar.color"
  />
</template>
