<script setup lang="ts">
  import { VForm } from 'vuetify/components/VForm'
  
  //👉👉 for agGrid---------------------------------------------------------------------------
  import { useConfigStore } from '@core/stores/config'
  import { useMyStore } from '@/stores/my'
  import { AgGridVue } from 'ag-grid-vue3'
  import {ColDef, CellValueChangedEvent} from 'ag-grid-community'
  //theme
  const myStore = useMyStore()
  const configStore=useConfigStore()
  watch(()=>configStore.theme,(newValue,oldValue)=>{
      const userPreferredColorScheme = usePreferredColorScheme()
      const userTheme=userPreferredColorScheme.value==='dark'?'ag-theme-quartz-dark':'ag-theme-quartz'
      myStore.agGridthemeClass=configStore.theme==='system'?userTheme:configStore.theme==='dark'? 'ag-theme-quartz-dark':'ag-theme-quartz'
  })

  const columnDefs=ref<ColDef[]>([
    {
      field:'permissionName',
      filter:true,
      floatingFilter:true
    },
    {field:'create',editable:true},
    {field:'read',editable:true},
    {field:'update',editable:true},
    {field:'delete',editable:true}
  ])
  const rowData=ref<any[]>([])
  const autoSizeStrategy = ref({})
  //Event
  const onCellValueChanged=async (event:CellValueChangedEvent)=>{
    let operationName:string=event.column.getColId()
    let operationValue:boolean=event.newValue
    
    try {
      const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/updatepermissioninrole`,{
        method:'PUT',
        body:{
          RoleName:props.roleName,
          PermissionName:event.data.permissionName,
          OperationName:operationName,
          OperationValue:operationValue
        },
        onResponseError({response}){
          snackbar.visible=true
          snackbar.message=response._data.message
          snackbar.color='error'
        }
      })


      snackbar.visible=true
      snackbar.message=res.message
      snackbar.color='success'
    } catch (error) {
      console.log(error)
    }
  }

  //👉👉-----------------------------------------------------------------------------------

  interface Role{
        roleId:string
        roleName:string
    }

  

  /* interface Role {
    roleId:string
    roleName: string
    permissions: Permission[]
  } */

 /* interface Props {
    isDialogVisible: boolean
    roleName: String
  
  } */

  /* interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void
    (e: 'update:rolePermissions', value: Roles): void
  } */

/* const props = withDefaults(defineProps<Props>(), {
  rolePermissions: () => ({
    name: '',
    permissions: [],
  }),
})  */

//const emit = defineEmits<Emit>()
interface Permission {
  permissionName: string
  create: boolean
  read: boolean
  update: boolean
  delete: boolean
}

const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})

const props=defineProps({
  roleName:String,
})

// 👉 Fetching permissions in this role

watch(()=>props.roleName,async()=>{
  if(props.roleName){
    await $api<any>(`${import.meta.env.BASE_URL}api/user/getpermissionsinrole?roleName=${props.roleName}`).then(data=>{
      rowData.value=data
    })
  }
})

const addNewPermissionToRole=async ()=>{
  const newPermission=prompt('Please input new permission name to this role')
  if(newPermission){
    try {
      const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/updatepermissioninrole`,{
        method:'PUT',
        body:{
          RoleName:props.roleName,
          PermissionName:newPermission,
          OperationName:'read',
          OperationValue:true
        },
        onResponseError({response}){
          snackbar.visible=true
          snackbar.message=response._data.message
          snackbar.color='error'
        }
      })

      const newObject:Permission={
        permissionName:newPermission,
        create:false,
        read:true,
        update:false,
        delete:false
      }
      rowData.value.push(newObject)

      snackbar.visible=true
      snackbar.message=res.message
      snackbar.color='success'
    } catch (error) {
      console.log(error)
    }
            
  }

    
  
}


/* // 👉 Permission List
const permissions = ref<Permission[]>([
  {
    name: 'User Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Content Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Disputes Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Database Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Financial Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Reporting',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'API Control',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Repository Management',
    read: false,
    write: false,
    create: false,
  },
  {
    name: 'Payroll',
    read: false,
    write: false,
    create: false,
  },
]) */

/* const isSelectAll = ref(false)
const refPermissionForm = ref<VForm>()

const checkedCount = computed(() => {
  let counter = 0

  permissions.value.forEach(permission => {
    Object.entries(permission).forEach(([key, value]) => {
      if (key !== 'name' && value)
        counter++
    })
  })

  return counter
})

const isIndeterminate = computed(() => checkedCount.value > 0 && checkedCount.value < (permissions.value.length * 3)) */

/* // select all
watch(isSelectAll, val => {
  permissions.value = permissions.value.map(permission => ({
    ...permission,
    read: val,
    write: val,
    create: val,
  }))
}) */

/* // if Indeterminate is false, then set isSelectAll to false
watch(isIndeterminate, () => {
  if (!isIndeterminate.value)
    isSelectAll.value = false
})

// if all permissions are checked, then set isSelectAll to true
watch(permissions, () => {
  if (checkedCount.value === (permissions.value.length * 3))
    isSelectAll.value = true
}, { deep: true }) */

/* // if rolePermissions is not empty, then set permissions
watch(() => props, () => {
  if (props.rolePermissions && props.rolePermissions.permissions.length) {
    role.value = props.rolePermissions.name
    permissions.value = permissions.value.map(permission => {
      const rolePermission = props.rolePermissions?.permissions.find(item => item.name === permission.name)

      if (rolePermission) {
        return {
          ...permission,
          ...rolePermission,
        }
      }

      return permission
    })
  }
}) */

 /*const onSubmit = () => {
  const rolePermissions = {
    name: role.value,
    permissions: permissions.value,
  }

  emit('update:rolePermissions', rolePermissions)
  emit('update:isDialogVisible', false)
  isSelectAll.value = false
  refPermissionForm.value?.reset() 
}*/

/* const onReset = () => {
  emit('update:isDialogVisible', false)
  isDialogVisible.value=false
  isSelectAll.value = false
  refPermissionForm.value?.reset()
} */
  
  onBeforeMount(() => {
      autoSizeStrategy.value = {
          type: "fitCellContents",
      };
  });
  
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
    :width="$vuetify.display.smAndDown ? 'auto' : 700"
    v-model="isDialogVisible"
  >
    <!-- 👉 Dialog close btn -->
    <DialogCloseBtn @click="isDialogVisible=false" />

    <VCard >
      <VCardText >
        <!-- 👉 Title -->
        <h4 class="text-h4 text-center mb-2">
          Edit Role
        </h4>
        <p class="text-body-1 text-center mb-6">
          Set Role Permissions
        </p>

        <!-- 👉 Form -->
        <VForm ref="refPermissionForm">
          <div class="d-flex align-content-end justify-content-center gap-2 mb-2">
              <!-- 👉 Role name -->
              <AppTextField
                :value="props.roleName"
                disabled
                label="Role Name"
                variant="outlined"
              />
              <VBtn
                color="primary"
                class="mt-6"
                @click="addNewPermissionToRole"
              >
                Add Permission</VBtn>
          </div>
          <div cols="12" class="mb-2">
              <AgGridVue
                :columnDefs="columnDefs"
                :rowData="rowData"
                :autoSizeStrategy="autoSizeStrategy"
                :class=myStore.agGridthemeClass
                :row-height=40
                style="height: 320px"
                :on-cell-value-changed="onCellValueChanged"
            />
            </div>
          
          <!-- 👉 Role Permissions -->
           <div class="mb-2">
            
           </div>
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
