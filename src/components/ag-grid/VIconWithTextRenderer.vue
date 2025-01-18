<script setup lang="ts">
    const props=defineProps({params:Object})
    const listOfValue=props.params?.values;

    const color=(v:string)=>{
        const target= listOfValue.find((x:any)=>x.value===v)
        return target.color
    }

    const text=(v:string)=>{
        const target=listOfValue.find((x:any)=>x.value===v)
        return target.text
    }

    const icon=(v:string)=>{
        const target=listOfValue.find((x:any)=>x.value===v)
        return target.icon
    }

</script>
<template>
    <div class="d-flex align-center gap-x-2">
        <VIcon :size="22" 
            :icon= icon(props.params?.value)
            :color=color(props.params?.value)>
        </VIcon>
        <div class="text-capitalize">{{text(props.params?.value)}}</div>
    </div>
</template>
