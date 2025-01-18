<script setup lang="ts">
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import Swal from 'sweetalert2'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

const form=ref({
  email:''
})
const errors=ref({
  email:undefined,
  message:undefined
})

const onSubmit = async() => {
  try{
    const res=await $api(`${import.meta.env.BASE_URL}api/user/resendemailconfirmation`,{
      method:'POST',
      body:{
        email:form.value.email
      },
      onResponseError({response}){
        errors.value.email=response._data.errors?.Email
        errors.value.message=response._data.message
      }
    })

    errors.value.message=undefined
    Swal.fire({
      title:'Check your email inbox now!',
      icon:'success',
      html:`We've sent you a verification link to your email address <b><i>${form.value.email}</i></b>.Please check your email inbox and verify your email address.`,
    })

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

  <VRow
    class="auth-wrapper bg-surface"
    no-gutters
  >
    <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background w-100 me-0">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="padding-inline: 150px;"
        >
        </div>

        <img
          class="auth-footer-mask flip-in-rtl"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        >
      </div>
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-6"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Verify your email ✉️
          </h4>
          <p class="text-body-1 mb-0">
            Please enter your email for a link to verify your email address.
          </p>
        </VCardText>
        <VCardText>
          <VAlert v-if="errors.message" color="error" variant="tonal" density="compact" border="start">
            {{ errors.message }}
          </VAlert>
          <VForm @submit.prevent>
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="form.email"
                  autofocus
                  label="Email"
                  type="email"
                  placeholder="johndoe@email.com"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- Resend comfirm link -->
              <VCol cols="12">
                <VBtn block @click="onSubmit">
                  Resend Confirm Link
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon
                    icon="tabler-chevron-left"
                    size="20"
                    class="me-1 flip-in-rtl"
                  />
                  <span>Back to login</span>
                </RouterLink>
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
