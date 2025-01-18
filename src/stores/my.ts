import { defineStore } from "pinia";
import { useTheme } from "vuetify";

export const useMyStore=defineStore('my',()=>{
    const userPreferredColorScheme = usePreferredColorScheme()
    const userTheme=userPreferredColorScheme.value==='dark'?'ag-theme-quartz-dark':'ag-theme-quartz'

    const agGridthemeClass=ref('')
    const vuetifyTheme = useTheme()
    agGridthemeClass.value=vuetifyTheme.global.name.value==='system'?userTheme:vuetifyTheme.global.name.value==='dark'? 'ag-theme-quartz-dark':'ag-theme-quartz'

    return{agGridthemeClass}
})
