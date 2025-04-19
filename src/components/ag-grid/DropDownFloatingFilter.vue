<template>
  <VSelect
    class="mt-0"
    variant="outlined"
    density="compact"
    :items="items"
    item-title="text"
    item-value="value"
    return-object
    @update:model-value="onDropdownlistChanged"
  ></VSelect>
</template>
<script setup lang="ts">
    const props=defineProps({params:Object})
    const currentValue=ref({'text':'All','value':''})
    const items=ref([])

    const onDropdownlistChanged=(value:any)=>{
        currentValue.value={'text':value.text,'value':value.value}
        props.params.parentFilterInstance((instance:any)=>{
            instance.onFloatingFilterChanged('equals',currentValue.value.value)
        })
    }
   
    const onParentModelChanged=(parentModel:any)=>{
        currentValue.value=!parentModel?null:parentModel.filter
    }
    
    onBeforeMount(()=>{
        items.value=props.params.values

    })

</script>
