<script setup lang="ts">
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
    roles: Array<string>
  }
  /*
    interface Props {
      userData?: UserData
      isDialogVisible: boolean
    }

    interface Emit {
      (e: 'submit', value: UserData): void
      (e: 'update:isDialogVisible', val: boolean): void
    }

    const props = withDefaults(defineProps<Props>(), {
      userData: () => ({
        userId: '',
        employeeId: '',
        firstName: '',
        lastName: '',
        gender: '',
        active: true,
        position: '',
        department: '',
        email: '',
        emailConfirmed:false,
        photo:'',
        roles: []
      }),
    }) */

  //const emit = defineEmits<Emit>()

  //const userData = ref<UserData>(props.userData)
  const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
  const userDataBefore=defineModel<UserData>('userData',{required:true})
  const userData=ref<UserData>(structuredClone(toRaw(userDataBefore.value)))

  // 👉 Fetching roles
  const roles = await $api<any>(`${import.meta.env.BASE_URL}api/user/getroles`)

  /* watch(() => props, () => {
    userData.value = props.userData
  }) */

  
  /* const loaded=(e)=>{
    const fr=e.target
    var result=fr.result
    changeStatus('Finished Loading!')
    fileBase64=result
    //console.log('Result:',result)
  }

  

  const processFile=(file:File)=>{
    const fr=new FileReader()
    fr.readAsDataURL(file)
    fr.addEventListener('loadstart',changeStatus('Start Loading'))
    fr.addEventListener('load',changeStatus('Loaded'))
    fr.addEventListener('loadend',loaded)
    fr.addEventListener('progress',setProgress)
    fr.addEventListener('error',errorHandler)
    fr.addEventListener('abort',changeStatus('Interrupted'))
  } */

  /* const changeAvatar = (e: Event) => {
    const file=(e.target as HTMLInputElement).files![0]
    if(file){
      progressValue.value=0
      processFile(file)
      updateAvatar()
    }



    console.log(fileBase64)
    if (file) {
      
      //console.log(fileBase64.value)
      //updateAvatar()

      /* fileReader.readAsDataURL(files[0])
      fileReader.onload = () => {
        if (typeof fileReader.result === 'string')
          accountDataLocal.value.avatarImg = fileReader.result
      } 
    }
  } 

     /* const updateAvatar= async (resetPhoto:boolean)=>{

    try {
      const res= await $api<any>(`${import.meta.env.BASE_URL}api/image/updateavatar`,{
        method:'POST',
        body:{
          userid:userData.value.userId,
          base64string:resetPhoto?'nopic.png':fileBase64
        }
      })
      snackbar.visible=true
      snackbar.color='success'
      snackbar.message=res.message
      userData.value.photo=fileBase64

    } catch (error:any) {
      console.log(error)
      snackbar.visible=true
      snackbar.message=error
    }
  } */

  const onFormSubmit = async () => {
    try{
      const res=await $api(`${import.meta.env.BASE_URL}api/user/updateuserprofile`,{
        method:'PUT',
        body:{
          userId:userData.value.userId,
          employeeId:userData.value.employeeId,
          firstName:userData.value.firstName,
          lastName:userData.value.lastName,
          gender:userData.value.gender,
          active:userData.value.active,
          position:userData.value.position,
          department:userData.value.department,
          emailConfirmed:userData.value.emailConfirmed,
          roles:userData.value.roles
        },
        onResponseError({response}){
          snackbar.visible=true
          snackbar.message=response._data.errors
          snackbar.color='error'
        }
      })

      isDialogVisible.value=false
      userDataBefore.value=structuredClone(toRaw(userData.value))

      snackbar.visible=true
      snackbar.message=res.message
      snackbar.color='success'
    }catch(error){
      console.log(error)
    }
    
    /* emit('update:isDialogVisible', false)
    emit('submit', userData.value)
    */
  }

  const onFormReset = () => {
    isDialogVisible.value=false
    userData.value = structuredClone(toRaw(userDataBefore.value))

    //emit('update:isDialogVisible', false)
  }

  const dialogModelValueUpdate = (val: boolean) => {
    isDialogVisible.value=val
    //emit('update:isDialogVisible', val)
  }

  const genders=[
    {text:'',value:''},
    {text:'Male',value:'M'},
    {text:'Female',value:'F'}
  ]
  const positions=['Worker','Staff','LL','ASV','SV','ASC','SC','SMGR','ADMGR','DMGR','Director']
  const departments=[
    'Account','Dyeing','Exim','Fabric Develop','Factory 1','Factory 2','Factory 3',
    'HR&Admin','Inter','Knitting','Printing','Sales1','Sales2','Sales3',
    'Sales4','Sales5','Setting','SLL','System','Thai Parfun','TPiCS'
  ]
  const emailVerified=[
    {text:'Verified',value:true},
    {text:'Pending',value:false}
  ]
  const status=[
    {text:'Active',value:true},
    {text:'Inactive',value:false}
  ]

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
    :width="$vuetify.display.smAndDown ? 'auto' : 900"
    v-model="isDialogVisible"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-2">
      <VCardText>
        <!-- 👉 Form -->
        <VForm
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12" md="6">
              <AppTextField
                v-model="userData.firstName"
                label="First Name"
                placeholder="John"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol cols="12" md="6">
              <AppTextField
                v-model=userData.lastName
                label="Last Name"
                placeholder="Doe"
              />
            </VCol>

            <!-- 👉 Email -->
            <VCol cols="12" md="6">
              <AppTextField
                v-model=userData.email
                label="Email"
                placeholder="johndoe@email.com"
                readonly
              />
            </VCol>

            <!-- 👉 EmployeeId -->
            <VCol cols="12" md="6">
              <AppTextField
                v-model=userData.employeeId
                type="number"
                label="Employee Id"
                placeholder="123456"
              />
            </VCol>

            <!-- 👉 Gender -->
            <VCol cols="12" md="6">
              <AppSelect
                v-model=userData.gender
                label="Gender"
                :items="genders"
                item-title="text"
                item-value="value"
                single-line
              />
            </VCol>

            <!-- 👉 Position -->
            <VCol cols="12" md="6">
              <AppSelect
                v-model=userData.position
                label="Position"
                placeholder="Select Position"
                :items="positions"
              />
            </VCol>

            <!-- 👉 Department -->
            <VCol cols="12" md="6">
              <AppSelect
                v-model=userData.department
                label="Department"
                placeholder="Select Department"
                :items="departments"
              />
            </VCol>

            <!-- 👉 Email Verified -->
            <VCol cols="12" md="6">
              <AppSelect
                v-model=userData.emailConfirmed
                label="Email Verified"
                :items="emailVerified"
                item-title='text'
                item-value='value'
                single-line
              />
            </VCol>

            <!-- 👉 Status -->
            <VCol cols="12" md="6">
              <AppSelect
                v-model=userData.active
                label="Status"
                :items=status
                item-title='text'
                item-value='value'
                single-line
              />
            </VCol>

            <!-- 👉 Roles -->
            <VCol cols="12" md="6">
              <AppSelect
                v-model=userData.roles
                closable-chips
                chips
                multiple
                label="Roles"
                placeholder="Roles"
                :items="roles"
              />
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCol
              cols="12"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <VBtn type="submit">
                Save Changes
              </VBtn>

              <VBtn
                color="secondary"
                variant="tonal"
                @click="onFormReset"
              >
                Cancel
              </VBtn>
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
