<script setup lang="ts">
import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue'

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

    const userData=defineModel<UserData>('userData',{required:true})
    const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
    const refInputEl = ref<HTMLElement>()
    const fileBase64Temp=ref()

    const changeAvatar=(e:Event)=>{
        const file=(e.target as HTMLInputElement).files![0]
        if(file){
            const fr=new FileReader()
            fr.readAsDataURL(file)
            fr.addEventListener('loadend',()=>{
                fileBase64Temp.value=fr.result
                updateAvatar(false)    
            })
        }
    }

    const resetAvatar=()=>{
        if(userData.value.photo!='nopic.png'){
            updateAvatar(true)
        }    
    }

    const updateAvatar= async (resetPhoto:boolean)=>{

        try {
            const res= await $api<any>(`${import.meta.env.BASE_URL}api/image/updateavatar`,{
                method:'POST',
                body:{
                    userid:userData.value.userId,
                    base64string:resetPhoto?'nopic.png':fileBase64Temp.value
                }
            })

            if(resetPhoto){
                userData.value.photo='nopic.png'
                userData.value.fileBase64=''
            }else{
                userData.value.photo=res.fileName
                userData.value.fileBase64=fileBase64Temp.value
            }
            
        } catch (error:any) {
            console.log(error)

        }
    }
</script>
<template>
    <VDialog
        v-model="isDialogVisible"
        transition="dialog-bottom-transition"
        :width="$vuetify.display.smAndDown ? 'auto' : 450"
    >
        <DialogCloseBtn @click="isDialogVisible=false" />
        <VList rounded="lg" >
            <VListItem>
                <template v-slot:prepend>
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
                        class="text-3xl font-weight-medium"
                    >
                        {{ avatarText(`${userData.firstName} ${userData.lastName}`) }}
                    </span>
                    </VAvatar>
                </template>
                <template v-slot:append>
                    <!-- 👉 Upload Photo -->
                    <div class="d-flex flex-column justify-center gap-4">
                        <div class="d-flex flex-wrap gap-4">
                            <VBtn
                                color="primary"
                                size="small"
                                @click="refInputEl?.click()"
                                >
                                <VIcon
                                    icon="tabler-cloud-upload"
                                    class="d-sm-none"
                                />
                                <span class="d-none d-sm-block">Upload new photo</span>
                            </VBtn>

                            <input
                                ref="refInputEl"
                                type="file"
                                name="file"
                                accept=".jpeg,.png,.jpg,.gif"
                                hidden
                                @input="changeAvatar"
                            >

                            <VBtn
                                type="reset"
                                size="small"
                                color="secondary"
                                variant="tonal"
                                @click="resetAvatar"
                            >
                            <span class="d-none d-sm-block">Reset</span>
                            <VIcon
                                icon="tabler-refresh"
                                class="d-sm-none"
                            />
                            </VBtn>
                        </div>

                        <p class="text-body-1 mb-0">
                            Allowed JPG, GIF or PNG. Max size of 2M
                        </p>
                    </div>
                </template>
            </VListItem>
        </VList>
    </VDialog>    
</template>
