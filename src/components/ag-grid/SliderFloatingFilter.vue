<template>
    <input 
        ref="inputRef"
        type="range"
        :value="currentValue" 
        min="0" :max="maxValue" step="1"
        @change="onValueChanged($event)"    
    />
</template>
<script setup>
    //import {ref, onBeforeMount } from 'vue';
    const props=defineProps({params:Object})
    const inputRef=ref(null)
    const maxValue=ref(0)
    const currentValue=ref(0)

    const onValueChanged=(event)=>{
        currentValue.value=event.target.value
        let valueToUse=currentValue.value===0?null:currentValue.value
        props.params.parentFilterInstance((instance)=>{
            instance.onFloatingFilterChanged('greaterThan',valueToUse)
        })
    }

    const onParentModelChanged=(parentModel)=>{
        currentValue.value=!parentModel?0:parentModel.filter
    }

    onBeforeMount(()=> {
        maxValue.value=props.params.maxValue    
    })
</script>

    

