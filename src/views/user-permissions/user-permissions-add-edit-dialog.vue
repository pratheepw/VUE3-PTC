<script setup lang="ts">
  const mode=defineModel<string>('mode')
  const isDialogVisible=defineModel<boolean>('isDialogVisible')
  const gridData=defineModel<any[]>('gridData')
  const currentRolesEdit=defineModel<any>('currentRolesEdit')
  
  const props=defineProps({ 
    currentPermissionName:String,
    currentRoles:Array 
  })

  const currentPermissionName=ref(props.currentPermissionName)
  const currentRoles=ref(props.currentRoles)
  const allRoles=ref<any[]>([])

  // 👉 Fetching all roles
  const getAllRoles=async()=>{
    allRoles.value= await $api<any>(`${import.meta.env.BASE_URL}api/user/getroles`)
  }
  getAllRoles()

  const addPermission=async ()=>{
    try {
      const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/createpermission`,{
        method:'POST',
        body:{
          PermissionName:currentPermissionName.value,
          PermissionValue:'read',
          RolesName:currentRoles.value
        },
        onResponseError({response}){
          snackbar.visible=true
          snackbar.message=response._data.message
          snackbar.color='error'
        }
      })

      gridData.value?.push({
        permissionName:currentPermissionName.value,
        roleNames:currentRoles.value
      })

      currentPermissionName.value=''
      currentRoles.value=[]
      isDialogVisible.value=false
          
      snackbar.visible=true
      snackbar.message=res.message
      snackbar.color='success'
    } catch (error:any) {
      console.log(error)
    }
  }

  const onSubmit= async ()=>{
    if(mode.value==='edit'){
      //Edit
      //currentRoles.value=currentRolesEdit.value
      try {
        const result=await $api<any>(`${import.meta.env.BASE_URL}api/user/deletepermission?permissionname=${currentPermissionName.value}`,{
          method:'DELETE',
          onResponseError({response}){
            snackbar.visible=true
            snackbar.message=response._data.message
            snackbar.color='error'
          }
        })

        const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/createpermission`,{
          method:'POST',
          body:{
            PermissionName:currentPermissionName.value,
            PermissionValue:'read',
            RolesName:currentRoles.value
          },
          onResponseError({response}){
            snackbar.visible=true
            snackbar.message=response._data.message
            snackbar.color='error'
          }
        })
        mode.value='update'
        isDialogVisible.value=false
        currentRolesEdit.value=currentRoles.value

      } catch (error:any) {
        console.log(error)
      }

    }else{
      //Add
      if(currentPermissionName.value &&  currentRoles.value?.length){
        addPermission()
      }else{
        snackbar.visible=true
        snackbar.message='Please input permission name and roles.'
        snackbar.color='warning'
      }
    }
  }

  const onReset=()=>{
    if(mode.value==='edit'){
      currentRoles.value=props.currentRoles
      isDialogVisible.value=false
    }else{
      isDialogVisible.value=false
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
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 600"
    v-model="isDialogVisible"
  >
    <VCard class="pa-2">
      <VCardText>
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2 text-capitalize">
          {{ mode }} Permission
        </h4>
        <p class="text-body-1 text-center mb-6 text-capitalize">
          {{ mode }}  permission as per your requirements.
        </p>

        <!-- 👉 Form -->
        <VForm>
          <VRow>
            <VCol cols="12">
              <AppTextField
                v-if="mode==='add'"
                v-model="currentPermissionName"
                placeholder="Enter Permission Name"
                label="Permission Name"
              />
              <AppTextField
                v-else
                v-model="currentPermissionName"
                placeholder="Enter Permission Name"
                label="Permission Name"
                disabled
              />
            </VCol>
            <VCol cols="12">
              <AppSelect
                v-model="currentRoles"
                closable-chips
                chips
                multiple
                label="Roles"
                placeholder="Roles"
                :items="allRoles"
              />
            </VCol>
            <VCol 
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VAlert
                v-if="mode==='edit'"
                type="warning"
                variant="tonal"
           
              >
                All roles in this permission will be delete and insert new roles in readonly mode.
              </VAlert>
              <VBtn @click="onSubmit">
                {{ mode==='add' ? 'Add' : 'Update' }}
              </VBtn>
              <VBtn color="secondary" variant="tonal" @click="onReset">Cancel</VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>

  <SnackbarAlert
    v-model:is-visible="snackbar.visible"
    :message="snackbar.message"
    :color="snackbar.color"
  />
</template>
