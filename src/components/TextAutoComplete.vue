<script setup lang="ts">
    import { useDebounceFn } from '@vueuse/core'

    interface AutocompleteData{
        label:string
        itemTitle:string
        itemValue:string
        itemValue2:string//ใช้ในกรณีให้คืนค่าไปใน Object อื่นหลังจากเลือก autocomplete
        listTitle:string
        listSubTitle:string
    }

    const selectedItem=defineModel<AutocompleteData>('selectedItem')

    const props=defineProps({
        apiUrl:String,
        field:String
    })

    const loading=ref(false)
    const search=ref('')
    const select=ref('')
    const items=ref<AutocompleteData[]>([])

    watchEffect(()=>{
        if(search.value!=select.value){0
            onQuerySelections(search.value)
        }
    })

    watch(selectedItem,(newSelected,oldSelected)=>{
        if (newSelected) {
            if(items.value.some((item:AutocompleteData)=>item.itemValue===newSelected.itemValue)){
                return
            }
            items.value.push(newSelected)
        }
        select.value=newSelected?.itemValue||''
    })

    const querySelections= async (query:string)=>{
        if(query.length<2){
            return
        }

        loading.value=true

        const res:AutocompleteData[]=await $api<any>(`${import.meta.env.BASE_URL}${props.apiUrl}?field=${props.field}&term=${query}`)
        items.value= await res.map(x=>({
            label:x.label,
            itemTitle:x.itemTitle,
            itemValue:x.itemValue,
            itemValue2:x.itemValue2,
            listTitle:x.listTitle,
            listSubTitle:x.listSubTitle
        }))
        loading.value=false        
    }

    const onQuerySelections=useDebounceFn((val)=>{
        querySelections(val)
    },500)

    const handleSelect=(value:string)=>{
        if(value){
            selectedItem.value=items.value.find(item=>item.itemValue===value)

        }
    }

</script>
<template>
    <VAutocomplete
        v-model="select"
        v-model:search="search"
        :loading="loading"
        :items="items"
        item-title="itemTitle"
        item-value="itemValue"
        :label="selectedItem?.label"
        clearable
        @update:model-value="handleSelect"
    >
        <template #item="{props,item}">
            <VListItem 
                v-bind="props"
                :title="item.raw.listTitle"
                :subtitle="item.raw.listSubTitle"
                >
            </VListItem>
        </template>
    </VAutocomplete>
</template>
