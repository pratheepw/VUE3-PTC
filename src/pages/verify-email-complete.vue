<script setup lang="ts">
/* import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant' */
/* import authV2VerifyEmailIllustrationDark from '@images/pages/auth-v2-verify-email-illustration-dark.png'
import authV2VerifyEmailIllustrationLight from '@images/pages/auth-v2-verify-email-illustration-light.png' */
/* import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png' */
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

/* const authThemeImg = useGenerateImageVariant(
  authV2VerifyEmailIllustrationLight,
  authV2VerifyEmailIllustrationDark,
) */

/* const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark) */
const route=useRoute()

const message=ref({
  info:undefined,
  error:undefined
})

onMounted(async()=>{
  try{
    const res=await $api(`${import.meta.env.BASE_URL}api/user/confirmemail?userId=${route.query.UserId}&token=${route.query.Token}`,{
      method:'GET',
      onResponseError({response}){
        const userIdError=response._data.errors?.userId
        const tokenError=response._data.errors?.token
        const generalError=response._data.message
        if(userIdError){
          message.value.error=userIdError
        }else if(tokenError){
          message.value.error=tokenError
        }else{
          message.value.error=generalError
        }
      }
    })
    console.log(res)
    message.value.info=res.message

  }catch(err){
    console.log(err)
  }
})

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
    <!-- <VCol
      md="8"
      class="d-none d-md-flex"
    >
      <div class="position-relative bg-background w-100 me-0">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="padding-inline: 150px;"
        >
          <VImg
            max-width="431"
            :src="authThemeImg"
            class="auth-illustration mt-16 mb-2"
          />
        </div>

        <img
          class="auth-footer-mask flip-in-rtl"
          :src="authThemeMask"
          alt="auth-footer-mask"
          height="280"
          width="100"
        >
      </div>
    </VCol> -->

    <VCol cols="12" class="auth-card-v2 d-flex align-center justify-center">
      <VCard flat class="mt-12 mt-sm-0 pa-6">
        <VCardText>
          <VAlert v-if="message.info" color="success" variant="tonal" class="text-h5 mb-3" prominent icon="tabler-check">{{ message.info }}</VAlert>
          <VAlert v-else color="error" variant="tonal" class="text-h5 mb-3" prominent icon="tabler-x">{{ message.error }}</VAlert>
          <VForm>
            <VRow>
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
