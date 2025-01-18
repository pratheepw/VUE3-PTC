<!-- ❗Errors in the form are set on line 60 -->
<script setup lang="ts">
import { VForm } from 'vuetify/components/VForm'
import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
import ptcPanorama from '@images/pages/ptc-panorama.jpg'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import {jwtDecode, JwtPayload} from 'jwt-decode'
import { useAuthStore } from '@/stores/auth'
import { subject } from '@casl/ability'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

interface UserAbilityRules{
  action:string,
  subject:string
}

const isPasswordVisible = ref(false)

const route = useRoute()
const router = useRouter()
const ability = useAbility()

 const errors=ref({
  email:undefined,
  password:undefined,
  message:undefined,
})

const refVForm = ref<VForm>()

const credentials = ref({
  email: '',
  password: '',
})

const rememberMe = ref(false)



const login = async () => {
  try {
    const res = await $api(`${import.meta.env.BASE_URL}api/user/login`, {
      method: 'POST',
      body: {
        email: credentials.value.email,
        password: credentials.value.password,
      },
      onResponseError({ response }) {
        errors.value.email=response._data.errors?.Email
        errors.value.password=response._data.errors?.Password
        errors.value.message=response._data.message
        
      },
    })

    const {accessToken,refreshToken,profilePhoto}=res;
    const decode=jwtDecode<any>(accessToken);
    const userRole=ref('')
    const userAbilityRules=ref<UserAbilityRules[]>([])

    if(Array.isArray(decode.roles)){
      if(decode.roles.includes('admin')){
        userRole.value='admin'
        userAbilityRules.value=[{ action:'manage', subject:'all'}]
      }else{
        userRole.value= decode.roles[0]
        if(decode.permissions){
          const permissions=decode.permissions
          const rules:any=[]
          permissions.forEach((permission:any)=>{
            const obj=JSON.parse(permission)
            console.log(permission)
            rules.push({
              action:obj.action,
              subject:obj.subject
            })
          })
          userAbilityRules.value=rules
        }else{
          userAbilityRules.value=[{action:'read',subject:'home'}]
        }
        
        
      }
    }else{
      if(decode.roles==='admin'){
        userRole.value='admin'
        userAbilityRules.value=[{ action:'manage', subject:'all'}]
      }else{
        userRole.value= decode.roles
        if(decode.permissions){
          const permissions=decode.permissions
          const rules:any=[]
          permissions.forEach((permission:any)=>{
            const obj=JSON.parse(permission)
            console.log(permission)
            rules.push({
              action:obj.action,
              subject:obj.subject
            })
          })
          userAbilityRules.value=rules
        }else{
          userAbilityRules.value=[{action:'read',subject:'home'}]
        }
        
      }
    }
   
    const userData:any={
      id:decode.user_id,
      fullName:decode.first_name+ ' '+decode.last_name,
      username:decode.name,
      email:decode.name,
      role:userRole.value,
      permissions:userAbilityRules.value
    }

    console.log(userData)

    useLocalStorage('avatar',(profilePhoto==='nopic.png')?'':profilePhoto)
    useCookie('userAbilityRules').value =userData.permissions
    ability.update(userData.permissions)
      
    useCookie('userData').value = userData
    useCookie('accessToken').value = accessToken//accessToken
    useCookie('refreshToken').value=refreshToken

    const authStore=useAuthStore()
    authStore.startRefreshTokenTimer(accessToken)


    // Redirect to `to` query if exist or redirect to index route
    // ❗ nextTick is required to wait for DOM updates and later redirect
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/home')
    })
  }
  catch (err) {
    console.error(err)
  }
}

const onSubmit = () => {
  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid)
        login()
    })
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

  <VRow
    no-gutters
    class="auth-wrapper bg-surface"
  >
    <VCol md="8" class="d-none d-md-flex">
      <VImg :src="ptcPanorama" cover></VImg>
      
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-4"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Welcome to <span class="text-capitalize"> {{ themeConfig.app.title }} </span>! 👋🏻
          </h4>
          <p class="mb-0">
            Please sign-in to your account and start the adventure
          </p>
        </VCardText>
        <VCardText>
          <VAlert v-if="errors.message"  color="error" variant="tonal" density="compact" border="start">
            {{ errors.message }}
            <!-- <p class="text-sm mb-2">
              Admin Email: <strong>admin@demo.com</strong> / Pass: <strong>admin</strong>
            </p>
            <p class="text-sm mb-0">
              Client Email: <strong>client@demo.com</strong> / Pass: <strong>client</strong>
            </p> -->
          </VAlert>
        </VCardText>
        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.email"
                  label="Email"
                  placeholder="johndoe@email.com"
                  type="email"
                  autofocus
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <AppTextField
                  v-model="credentials.password"
                  label="Password"
                  placeholder="············"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between my-6">
                  <VCheckbox
                    v-if="false"
                    v-model="rememberMe"
                    label="Remember me"
                  />
                  <RouterLink 
                    class='text-primary ms-2 mb-1' 
                    :to="{name:'verify-email'}"
                  >
                    Re-send verification email</RouterLink>
                  <RouterLink
                    class="text-primary ms-2 mb-1"
                    :to="{ name: 'forgot-password' }"
                  >
                    Forgot Password?
                  </RouterLink>
                </div>

                <VBtn
                  block
                  type="submit"
                >
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-center"
              >
                <span>New on our platform?</span>
                <RouterLink
                  class="text-primary ms-1"
                  :to="{ name: 'register-multi-steps' }"
                >
                  Create an account
                </RouterLink>
              </VCol>
              <VCol v-if="false"
                cols="12"
                class="d-flex align-center"
              >
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- auth providers -->
              <VCol v-if="false"
                cols="12"
                class="text-center"
              >
                <AuthProvider />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
