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

</script>
<template>
    <VChip
        :color="color(props.params?.value)"
        size="small"
        label
        class=" text-capitalize">
        {{text(props.params?.value)}}
    </VChip>
</template>
