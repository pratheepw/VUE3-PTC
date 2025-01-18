<script setup lang="ts">
  import VChipArrayRenderer from '@/components/ag-grid/VChipArrayRenderer.vue';
  import userPermissionsAction from '@/views/user-permissions/user-permissions-action.vue';
  import UserPermissionsAddEditDialog from '@/views/user-permissions/user-permissions-add-edit-dialog.vue';

  definePage({
    meta:{
      action:'read',
      subject:'user-permissions'
    }
  })

  //const permissions = computed((): Permission[] => permissionsData.value.permissions)
  //const totalPermissions = computed(() => permissionsData.value.totalPermissions)

  // 👉 Fetching permissions
  const gridData=ref(await $api<any[]>(`${import.meta.env.BASE_URL}api/user/getpermissions`))
  
  const mode=ref('')
  const currentRolesEdit=ref([])


  const columnDefs=ref([
    {
      field:'permissionName',
      filter:true,floatingFilter:true,
    },
    {
      field:'roleNames',
      autoHeight:true,
      cellRenderer:'VChipArrayRenderer',
      cellRendererParams:(params:any)=>{
        return{
          templates:[
            {color:'primary',text:'Admin',value:'admin'},
            {color:'success',text:'Client',value:'client'},
            {color:'error',text:'Manager',value:'manager'}
          ]
        }
      }
    },
    {
      headerName:'Action',
      cellRenderer:'userPermissionsAction',
    }
  ])

  //<!-- 👉 Add/Edit Permission -->
  const isDialogVisible=ref(false)

  const addPermission=async ()=>{
    mode.value='add'
    isDialogVisible.value=true
  }
  
  
  defineExpose({
    VChipArrayRenderer,
    userPermissionsAction
  })
</script>

<template>
  <section>
    <div class="text-end">
      <VBtn 
        class="mb-2"
        @click="addPermission"
      >
        <VIcon
          start
          icon="tabler-plus"
        />
        Add Permission
      </VBtn>
    </div>
    <VCard>
      <AgGrid
        v-model:column-defs="columnDefs"
        v-model:row-data="gridData"
        :row-height="40"
        style="height: 500px;"
      />
    </VCard>
  </section>
  <UserPermissionsAddEditDialog
    v-model:mode="mode"
    v-model:is-dialog-visible="isDialogVisible"
    v-model:grid-data="gridData"
    v-model:current-roles-edit="currentRolesEdit"
  />
</template>

