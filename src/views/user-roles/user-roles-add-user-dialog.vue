<script setup lang="ts">
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

    const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
    const currentRole=defineModel<Role>('currentRole')

    //<!-- 👉 Add member -->
    const newMember=ref<UserData>()
    
    watch(newMember,newValue=>{
      addMemberToRole(newValue)  
    })

    const addMemberToRole=async(newValue:any)=>{
        if(newValue){
            const isInThisRole=currentRole.value?.users.some(x=>x.userId===newValue.userId)
            if(!isInThisRole){
                try {
                    const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/addusertorole`,{
                        method:'PUT',
                        body:{
                            userId:newValue.userId,
                            roleName:currentRole.value?.roleName
                        },
                        onResponseError({response}){
                            snackbar.visible=true
                            snackbar.message=response._data.message
                            snackbar.color='error'
                        }
                    })

                    currentRole.value?.users.push(newValue)

                } catch (error) {
                    console.log(error)
                }
            }
        }
    }
    
    //<!-- 👉 Remove member -->
    const removeMemberFromRole=async(e:any)=>{
        try {
            const res=await $api<any>(`${import.meta.env.BASE_URL}api/user/deleteuserfromrole`,{
                method:'DELETE',
                body:{
                    userId:e.userId,
                    roleName:currentRole.value?.roleName
                },
                onResponseError({response}){
                    snackbar.visible=true
                    snackbar.message=response._data.message
                    snackbar.color='error'
                }
            })

            const index:any=currentRole.value?.users.findIndex(item=>item.userId===e.userId)
            currentRole.value?.users.splice(index,1)
            
        } catch (error) {
            console.log(error)
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
    :width="$vuetify.display.smAndDown ? 'auto' : 450"
    v-model="isDialogVisible"
  >
    <VCard>
        <VCardText>
            <h4 class="text-h4 text-center text-capitalize mb-2">{{ currentRole?.roleName }}</h4>
            <AvatarAutoComplete
                v-model:new-member="newMember"
            />
            <h5 class="text-h5 mb-4 mt-6">{{ currentRole?.users.length }} Members</h5>
            <VList class="card-list">
                <VListItem
                    v-for="member in currentRole?.users"
                    :key="member.userId"
                >
                    <template #prepend>
                        <VAvatar
                            :variant="member.photo=='nopic.png' ? 'tonal' : undefined"
                            :color="member.photo=='nopic.png' ? 'primary' : undefined"
                        >
                            <UserPhoto
                                :photo="member.photo"
                                :firstName="member.firstName"
                                :lastName="member.lastName"
                            />
                        </VAvatar>
                    </template>
                    <VListItemTitle>{{member.firstName }} {{ member.lastName }}</VListItemTitle>
                    <VListItemSubtitle>{{ member.email }}</VListItemSubtitle>
                    <template #append>
                        <VBtn 
                            size="small" 
                            color="error"
                            variant="tonal"
                            :value="member.userId"
                            @click="removeMemberFromRole(member)"
                        >
                            <VIcon icon="tabler-trash"></VIcon>
                            Remove
                        </VBtn>
                    </template>

              </VListItem>
            </VList>
        </VCardText>
    </VCard>
  </VDialog>
</template>
