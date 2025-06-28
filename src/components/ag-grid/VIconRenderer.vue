<script setup lang="ts">
    const props=defineProps({params:Object})
    const listOfValue=props.params?.values;

    const color=(v:any)=>{
        const target= listOfValue.find((x:any)=>x.value===v)
        return target.color
    }

    const icon=(v:any)=>{
        const target=listOfValue.find((x:any)=>x.value===v)
        return target.icon
    }

</script>
<template>
    <div>
        <VIcon 
            v-if="props.params?.value"
            :size="22" 
            :icon= icon(props.params?.value)
            :color=color(props.params?.value)>
        </VIcon>
    </div>
</template>
