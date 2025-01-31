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

import { useAuthStore } from './stores/auth'

const startApp=async ()=>{
    // Create vue app
    const app = createApp(App)

    // Register plugins
    registerPlugins(app)

    try {
        const accessToken=useCookie('accessToken').value
        const refreshToken=useCookie('refreshToken').value

        //if(accessToken && refreshToken){
            const authStore=useAuthStore()
            await authStore.refreshToken()
            console.log('refresh token')
        //}
        
    } catch (error) {
        console.log(error)
    }

    // Mount vue app
    app.mount('#app')
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

