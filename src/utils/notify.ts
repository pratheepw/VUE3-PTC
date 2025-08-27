import { useToast } from "vue-toastification"
import ToastContent from "@/components/ToastContent.vue"
import '@styles/toast.css'

const toast = useToast()

function showToast(
  type: "success" | "error" | "warning" | "info" | "default",
  payload: { title: string; subtitle?: string; detail?: string },
  options = {}
) {
  toast(
    {
      component: ToastContent,
      props: { type, ...payload },
    },
    { 
      timeout: false, 
      toastClassName: `Vue-Toastification__toast--${type}`,
      ...options 
    }
  )
}

export const notify = {
  success(title: string, options = {}) {
    showToast("success", { title }, options)
  },
  error(title: string, options = {}) {
    showToast("error", { title }, options)
  },
  warning(title: string, options = {}) {
    showToast("warning", { title }, options)
  },
  info(title: string, options = {}) {
    showToast("info", { title }, options)
  },
  default(title: string, options = {}) {
    showToast("default", { title }, options)
  },

  custom: {
    success(payload: { title: string; subtitle?: string; detail?: string }, options = {}) {
      showToast("success", payload, options)
    },
    error(payload: { title: string; subtitle?: string; detail?: string }, options = {}) {
      showToast("error", payload, options)
    },
    warning(payload: { title: string; subtitle?: string; detail?: string }, options = {}) {
      showToast("warning", payload, options)
    },
    info(payload: { title: string; subtitle?: string; detail?: string }, options = {}) {
      showToast("info", payload, options)
    },
    default(payload: { title: string; subtitle?: string; detail?: string }, options = {}) {
      showToast("default", payload, options)
    },
  },
}
