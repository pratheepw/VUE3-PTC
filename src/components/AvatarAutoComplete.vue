<script setup lang="ts">
    interface UserData{
        userId:string
        firstName:string
        lastName:string
        email:string
        photo:string
        fullName:string
        imagePath:string
    }

    const newMember=defineModel<UserData>('newMember')
    
    const apiUrl=import.meta.env.VITE_API_BASE_URL
    const loading=ref(false)
    const search=ref()
    const select=ref(null)
    const items=ref<UserData[]>([])

    const querySelections= async (query:string)=>{
        loading.value=true

        const res:UserData[]=await $api<any>(`${import.meta.env.BASE_URL}api/user/getusersautocomplete?searchterm=${query}&pazesize=10`)
        items.value= await res.map(x=>({
            userId:x.userId,
            firstName:x.firstName,
            lastName:x.lastName,
            email:x.email,
            photo:x.photo,
            fullName:`${x.firstName} ${x.lastName}`,
            imagePath:`${apiUrl}/api/image/getavatar?fileName=${x.photo}`
        }))
        loading.value=false        
    }

    watch(search,query=>{
        query && query !==select.value && querySelections(query)
    })
    
    const handleSelect=(value:string)=>{
        if(value){
            const selectedObject=items.value.find(item=>item.userId===value)
            newMember.value=selectedObject
            select.value=null
        }
    }

</script>
<template>
    <VAutocomplete
        v-model="select"
        v-model:search="search"
        :loading="loading"
        :items="items"
        item-title="email"
        item-value="userId"
        placeholder="Type here..."
        label="Type the email to search"
        clearable
        @update:model-value="handleSelect"
    >
        <template #item="{props,item}">
            <VListItem 
                v-bind="props"
                :title="item.raw.fullName"
                :subtitle="item.raw.email"
                >
                <template #prepend>
                    <VAvatar :image="item.raw.imagePath" size="35"/>
                </template>
            </VListItem>
        </template>
    </VAutocomplete>
</template>
