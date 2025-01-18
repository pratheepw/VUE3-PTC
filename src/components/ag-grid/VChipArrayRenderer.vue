<script setup lang="ts">
    const props=defineProps({params:Object})
    const listOfTemplate=props.params?.templates;

    const color=(v:string)=>{
        const target= listOfTemplate.find((x:any)=>x.value===v.toLowerCase())
        if(target){
            return target.color
        }else{
            return 'default'
        }
     }

    const text=(v:string)=>{
        const target=listOfTemplate.find((x:any)=>x.value===v.toLowerCase())
        if(target){
            return target.text
        }else{
            return v
        }
        
    }

</script>
<template>
    <div class="d-flex my-1 gap-1 flex-wrap">
    <VChip
        v-for="item in props.params?.value"
        :key="item"
        :color="color(item)"
        size="small"
        label
        class="text-capitalize "
    >
        {{text(item)}}
    </VChip>
</div>
</template>        
