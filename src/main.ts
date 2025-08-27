import { createApp } from 'vue'
import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// 3rd party styles
import "ag-grid-community/styles/ag-grid.css" // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css" // Optional Theme applied to the Data Grid
import "@styles/aggrid-styles.css"
import Vue3Toastify,{type ToastContainerOptions} from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import '@/assets/styles/toast.css'

//import Toast,{PluginOptions, POSITION} from 'vue-toastification'
//import "vue-toastification/dist/index.css"


import { useAuthStore } from './stores/auth'

const startApp=async ()=>{
    // Create vue app
    const app = createApp(App)

    //Toast
    app.use(
        Vue3Toastify,
        {
            autoClose:5000,
            dangerouslyHTMLString: true,
            theme:'colored'
            //...
        } as ToastContainerOptions
    )

    // Register plugins
    registerPlugins(app)

    try {
        const accessToken=useCookie('accessToken').value
        const refreshToken=useCookie('refreshToken').value

        //if(accessToken && refreshToken){
            const authStore=useAuthStore()
            await authStore.refreshToken()
            if(authStore.refreshTokenSuccess){
                console.log('refresh token success')
            }else{
                console.log('refresh token failed')
                authStore.stopRefreshTokenTimer()
                logout()
            }
            
        //}
        
    } catch (error) {
        console.log(error)
    }

    // Mount vue app
    app.mount('#app')
}

const logout = async () => {
    const userData = useCookie<any>('userData')
    const avatar= localStorage.getItem('avatar')
    const router = useRouter()
    //const ability = useAbility()

    // Remove "accessToken" from cookie
    useCookie('accessToken').value = null

    // Remove "refreshToken" from cookie
    useCookie('refreshToken').value=null

    // Remove "userData" from cookie
    userData.value = null
    localStorage.removeItem('avatar')

     
    
    // Redirect to login page
    await router.replace('/login')

    // ℹ️ We had to remove abilities in then block because if we don't nav menu items mutation is visible while redirecting user to login page
    // Remove "userAbilities" from cookie
    useCookie('userAbilityRules').value = null

    // Reset ability to initial ability
    //ability.update([])
}

startApp()



/* // Create vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

//Refresh token
//const authStore=useAuthStore()
//authStore.refreshToken()

// Mount vue app
app.mount('#app') */

