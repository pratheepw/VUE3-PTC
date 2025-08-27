<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import type { CustomInputContent } from '@core/types'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

//import registerMultiStepIllustrationDark from '@images/illustrations/register-multi-step-illustration-dark.png'
//import registerMultiStepIllustrationLight from '@images/illustrations/register-multi-step-illustration-light.png'

import registerMultiStepBgDark from '@images/pages/register-multi-step-bg-dark.png'
import registerMultiStepBgLight from '@images/pages/register-multi-step-bg-light.png'
import { VForm } from 'vuetify/components'
import { useBase64 } from '@vueuse/core'
import Swal from 'sweetalert2'

const registerMultiStepBg = useGenerateImageVariant(registerMultiStepBgLight, registerMultiStepBgDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const currentStep = ref(0)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

const router = useRouter()
//const route=useRoute()

const radioContent: CustomInputContent[] = [
  {
    title: 'Starter',
    desc: 'A simple start for everyone.',
    value: '0',
  },
  {
    title: 'Standard',
    desc: 'For small to medium businesses.',
    value: '99',
  },
  {
    title: 'Enterprise',
    desc: 'Solution for big organizations.',
    value: '499',
  },
]

const items = [
  {
    title: 'Account',
    subtitle: 'Account Details',
    icon: 'tabler-file-analytics',
  },
  {
    title: 'Personal',
    subtitle: 'Enter Information',
    icon: 'tabler-user',
  },
]

const selectedGender=ref({name:'',abbr:''})
const genders=[
  {name:'',abbr:''},
  {name:'Male',abbr:'M'},
  {name:'Female',abbr:'F'}
]

const positions=['Worker','Staff','LL','ASV','SV','ASC','SC','SMGR','ADMGR','DMGR','Director']
const departments=[
  'Account','Dyeing','Exim','Fabric Develop','Factory 1','Factory 2','Factory 3',
  'HR&Admin','Inter','Knitting','Printing','Sales1','Sales2','Sales3',
  'Sales4','Sales5','Setting','SLL','System','Thai Parfun','TPiCS'
]

const form = ref({
  employeeId: '',
  firstName: '',
  lastName: '',
  active:true,
  position: '',
  department: '',
  lineId:0,
  email: '',
  password: '',
  confirmPassword: '',
  photo: 'nopic.png',
})

const errors = ref({
  firstName: undefined,
  lastName: undefined,
  position: undefined,
  department: undefined,
  email: undefined,
  password: undefined,
  message:undefined
})

const file = ref() as Ref<File>
const { base64: fileBase64 } = useBase64(file)


const onFileInput= (e:Event)=>{
  file.value = (e.target as HTMLInputElement).files![0]
}

const onSubmit = async() => {
  try{
    const res=await $api(`${import.meta.env.BASE_URL}api/user/register`,{
      method:'POST',
      body:{
        employeeId:form.value.employeeId,
        firstName:form.value.firstName,
        lastName:form.value.lastName,
        gender:selectedGender.value.abbr,
        active:form.value.active,
        position:form.value.position,
        department:form.value.department,
        lineId:form.value.lineId,
        email:form.value.email,
        password:form.value.password,
        photo:fileBase64.value===''?'nopic.png': fileBase64.value,
      },
      onResponseError({response}){
        errors.value.email=response._data.errors?.Email
        errors.value.password=response._data.errors?.Password
        errors.value.firstName=response._data.errors?.FirstName
        errors.value.lastName=response._data.errors?.LastName
        errors.value.position=response._data.errors?.Position
        errors.value.department=response._data.errors?.Department
        errors.value.message=response._data.message
      }
    })
    Swal.fire({
      title:'Register complete.',
      icon:'success',
      text:`We've sent an email to ${form.value.email} to verify your email address and activate your account`
    })

    await router.replace('/login')


  }catch(err){
    console.log(err)
  }
}
</script>

<template>
  <RouterLink to="/">
    <div class="auth-logo d-flex align-center gap-x-3">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="auth-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow no-gutters class="auth-wrapper">
    <VCol md="4" class="d-none d-md-flex">
      <!-- here your illustration -->
      <div class="d-flex justify-center align-center w-100 position-relative">
        <img
          class="bg-image position-absolute w-100 flip-in-rtl"
          :src="registerMultiStepBg"
          alt="register-multi-step-bg"
          height="340"
        >
      </div>
    </VCol>

    <VCol cols="12" md="8"
      class="auth-card-v2 d-flex align-center justify-center pa-10"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard flat class="mt-12 mt-sm-10">
        <AppStepper
          v-model:current-step="currentStep"
          :items="items"
          :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
          icon-size="22"
          class="stepper-icon-step-bg mb-12"
        />
        <VAlert v-if="errors.message"  color="error" variant="tonal" density="compact" border="start">
          {{ errors.message }}
        </VAlert>

        <VWindow
          v-model="currentStep"
          class="disable-tab-transition"
          style="max-inline-size: 681px;"
        >
          <VForm>
            <VWindowItem>
              <h4 class="text-h4">
                Account Information
              </h4>
              <p class="text-body-1 mb-6">
                Enter Your Account Details
              </p>

              <VRow>
                <VCol cols="12">
                  <AppTextField
                    v-model="form.email"
                    label="Email"
                    placeholder="johndoe@email.com"
                    :error-messages="errors.email"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="form.password"
                    label="Password"
                    placeholder="············"
                    :error-messages="errors.password"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="form.confirmPassword"
                    label="Confirm Password"
                    placeholder="············"
                    :error-messages="errors.password"
                    :rules="[confirmedValidator(form.confirmPassword, form.password)]"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  />
                </VCol>

                <VCol cols="12" md="8">
                  <VFileInput
                    label="Profile Image"
                    accept="image/png, image/jpeg, image/gif"
                    prepend-icon="tabler-camera"
                    @input="onFileInput"
                    show-size
                  />
                </VCol>
                <VCol cols="12" md="4">
                  <VImg max-height="40" aspect-ratio="1/1" :src="fileBase64"/>
                </VCol>
              </VRow>
            </VWindowItem>

            <VWindowItem>
              <h4 class="text-h4">Personal Information</h4>
              <p>Enter Your Personal Information</p>

              <VRow>
                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="form.firstName"
                    label="First Name"
                    placeholder="John"
                    :error-messages="errors.firstName"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="form.lastName"
                    label="Last Name"
                    placeholder="Doe"
                    :error-messages="errors.lastName"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="form.employeeId"
                    label="Employee Id"
                    placeholder="123456"
                    maxlength="6"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppSelect
                    v-model="selectedGender"
                    label="Gender"
                    placeholder="Select Gender"
                    :items=genders
                    item-title="name"
                    item-value="abbr"
                    return-object
                    single-line
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppSelect
                    v-model="form.position"
                    label="Position"
                    placeholder="Select Position"
                    :items="positions"
                    :error-messages="errors.position"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppSelect
                    v-model="form.department"
                    label="Department"
                    placeholder="Select Department"
                    :items="departments"
                    :error-messages="errors.department"
                  />
                </VCol>
              </VRow>
            </VWindowItem>

          </VForm>
        </VWindow>

        <div class="d-flex flex-wrap justify-space-between gap-x-4 mt-6">
          <VBtn
            color="secondary"
            :disabled="currentStep === 0"
            variant="tonal"
            @click="currentStep--"
          >
            <VIcon
              icon="tabler-arrow-left"
              start
              class="flip-in-rtl"
            />
            Previous
          </VBtn>

          <VBtn v-if="items.length - 1 === currentStep" color="success" @click="onSubmit">
            submit
          </VBtn>
          <VBtn v-else @click="currentStep++">
            Next
            <VIcon icon="tabler-arrow-right" end class="flip-in-rtl"/>
          </VBtn>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.illustration-image {
  block-size: 550px;
  inline-size: 248px;
}

.bg-image {
  inset-block-end: 0;
}
</style>
