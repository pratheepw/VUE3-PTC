<script setup lang="ts">
import UserPermissionsAddEditDialog from './user-permissions-add-edit-dialog.vue'

    const props=defineProps({params:Object})
    const currentRolesEdit=ref([])

    const mode=ref('')
    const isDialogVisible=ref(false)

    const editPermission= async ()=>{
        mode.value='edit'
        isDialogVisible.value=true
     }

    const deletePermission=async()=>{
        if(confirm(`Do you want to delete permission: ${props.params?.data.permissionName}`)){
            try {
                const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/deletepermission?permissionname=${props.params?.data.permissionName}`,{
                    method:'DELETE',
                    onResponseError({response}){
                        snackbar.visible=true
                        snackbar.message=response._data.message
                        snackbar.color='error'
                    }
                })

                const selectedRow=props.params?.api.getRowNode(props.params?.node.id).data
                props.params?.api.applyTransaction({remove:[selectedRow]})

                snackbar.visible=true
                snackbar.message=res.message
                snackbar.color='success'
            } catch (error) {
                console.log(error)
            }
        }
    }

    watch(()=>mode.value,(newValue,oldValue)=>{
        if(newValue==='update'){
            const node=props.params?.api.getRowNode(props.params?.node.id)
            node.setDataValue('roleNames',currentRolesEdit.value)
        }
    })

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
    <div class="d-flex align-center">
        <VTooltip>
            <template #activator="{props}">
                <VBtn
                    v-bind="props"
                    icon="tabler-edit"
                    variant="text"
                    color="warning"
                    @click="editPermission"
                />
            </template>
            <span>Edit</span>
        </VTooltip>
        <VTooltip>
            <template #activator="{props}">
                <VBtn
                    v-bind="props"
                    icon="tabler-trash"
                    variant="text"
                    color="error"
                    @click="deletePermission"
                />
            </template>
            <span>Delete</span>
        </VTooltip>
    </div>

    <UserPermissionsAddEditDialog
        v-model:mode="mode"
        v-model:is-dialog-visible="isDialogVisible"
        v-model:current-roles-edit="currentRolesEdit"
        :current-permission-name="props.params?.data.permissionName"
        :current-roles="props.params?.data.roleNames"
    />
    <SnackbarAlert
        v-model:is-visible="snackbar.visible"
        :message="snackbar.message"
        :color="snackbar.color"
    />
</template>
