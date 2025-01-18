<script setup lang="ts">
    import UserPhoto from '@/components/UserPhoto.vue';

    interface UserData {
        userId: string
        employeeId: string
        firstName: string
        lastName: string
        gender: string
        active:boolean
        position: string
        department: string
        email: string
        emailConfirmed:boolean
        photo:string
        roles: Array<string>
    }

    const props=defineProps({params:Object})
    const item=ref<UserData>(props.params?.data)

</script>

<template>
    <div class="d-flex align-center gap-x-4">
        <VAvatar
            size="34"
            :variant="item.photo=='nopic.png' ? 'tonal' : undefined"
            :color="item.photo=='nopic.png' ? 'primary' : undefined"
        >
            <UserPhoto
                :photo="item.photo"
                :firstName="item.firstName"
                :lastName="item.lastName"
                class="text-md font-weight-medium"
            /> 
        </VAvatar>
        <div class="d-flex flex-column">
            <h6 class="text-base">
                <RouterLink
                    :to="{path:'user-view',query:{userId: item.userId } }"
                    class="font-weight-medium text-link"
                >
                    {{ item.firstName }} {{ item.lastName }}
                </RouterLink>
            </h6>
            <div class="text-sm">
            {{ item.email }}
            </div>
        </div>
    </div>
</template>

