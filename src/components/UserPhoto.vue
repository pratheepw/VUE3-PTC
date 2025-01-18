<script setup lang="ts">
    const props=defineProps({
        photo:String,
        firstName:String,
        lastName:String,
        
    })
    const avatar=ref()
    const getAvatar = async ()=>{
        if(props.photo==='nopic.png'){
            avatar.value= undefined
         }else{
            const res=await $api(`${import.meta.env.BASE_URL}api/image/getavatar?fileName=${props.photo}`)
            avatar.value=URL.createObjectURL(res)
        }
    }

    onMounted(()=>{
        getAvatar()
    })

</script>

<template>
    <VImg
        v-if="avatar"
        :src="avatar"
    >
        <VTooltip activator="parent" location="top">
            {{ props.firstName }} {{ props.lastName }}
        </VTooltip>
    </VImg>
    <span 
        v-else
        :class="$attrs.class"
    >
        {{ avatarText(`${props.firstName} ${props.lastName}`) }}
        <VTooltip activator="parent" location="top">
            {{ props.firstName }} {{ props.lastName }}
        </VTooltip>
    </span>
</template>
