import { jwtDecode, JwtPayload } from "jwt-decode";
import { defineStore } from "pinia";

export const useAuthStore=defineStore('auth',()=>{
    const refreshTokenTimeout=ref<any>(null)
    const refreshTokenSuccess=ref<boolean>(false)
    
    const refreshToken=async()=>{
        try {
            const res=await $api(`${import.meta.env.BASE_URL}api/user/refreshtoken`,{
                method:'POST',
                body:{
                    accesstoken:useCookie('accessToken').value,
                    refreshtoken:useCookie('refreshToken').value
                }
            })
            
            const{accessToken,refreshToken}=res
            useCookie('accessToken').value=accessToken
            useCookie('refreshToken').value=refreshToken
            refreshTokenSuccess.value=true

            startRefreshTokenTimer(accessToken)

        } catch (error) {
            console.log(error)

        }
    }

    const startRefreshTokenTimer=(jwtBase64:string)=> {
        // parse json object from base64 encoded jwt token
        //const jwtBase64 = this.user.jwtToken.split('.')[1];
        //const jwtToken = JSON.parse(atob(jwtBase64));
        const jwtToken = jwtDecode<JwtPayload>(jwtBase64)

        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);
        refreshTokenTimeout.value = setTimeout(refreshToken, timeout);
    }    
    
    const stopRefreshTokenTimer=()=>{
        clearTimeout(refreshTokenTimeout.value)
    } 
    

    return {refreshToken,startRefreshTokenTimer,stopRefreshTokenTimer,refreshTokenSuccess}
})
