<script setup lang="ts">
    import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
    import VIconRenderer from '@/components/ag-grid/VIconRenderer.vue';
    import {toast} from 'vue3-toastify'

    interface ItemMaster{
        code:string,
        description:string,
        pfCodeName:string,
        color:string,
        season:string,
        customer:string,
        model:string,
        unit:string,
        price:number,
        workType:string,
        section:string,
        supplier:string,
        codeSub:string,
        labNo:string,
        weightGSM:number,
        width:number,
        washing:number,
        ph:number,
        spirality:number,
        shrinkageL:number,
        shrinkageW:number,
        colorFastness:number,
        fabricContent:string,
        company:string,
        itemType:string,
        customerCode:string
        inputUser:string
    }

    const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
    const isReloadGrid=defineModel<boolean>('isReloadGrid',{required:true})
    const props=defineProps({
        editMode:String,
        itemCode:String
    })

    // 👉 Declare variable
    const rules10=[(v:string)=>v.length<=10||'Max 10 characters']
    const rules25=[(v:string)=>v.length<=25||'Max 25 characters']
    const rules50=[(v:string)=>v.length<=50||'Max 50 characters']
    const rules100=[(v:string)=>v.length<=100||'Max 100 characters']
    const rules255=[(v:string)=>v.length<=255||'Max 255 characters']
   
    const loadings=ref<boolean[]>([])
    const defaultForm:ItemMaster=
    {
        code:'',
        description:'',
        pfCodeName:'',
        color:'',
        season:'',
        customer:'',
        model:'',
        unit:'',
        price:0,
        workType:'',
        section:'',
        supplier:'',
        codeSub:'',
        labNo:'',
        weightGSM:0,
        width:0,
        washing:0,
        ph:0,
        spirality:0,
        shrinkageL:0,
        shrinkageW:0,
        colorFastness:0,
        fabricContent:'',
        company:'',
        itemType:'',
        customerCode:'',
        inputUser:''
    }
        
    const form=ref<ItemMaster>(defaultForm)
    //let oldSnapshot=structuredClone(toRaw(form.value))

    // 👉 Clear form
    const clearForm=()=>{
        form.value=defaultForm
        //oldSnapshot=structuredClone(toRaw(form.value))
    }
    
    watchEffect(()=>{
        if(props.editMode=='add'){
            clearForm()
        }else if(props.editMode=='edit'){
            editData()
        }
    })

    // // 👉 Watch form changes
    // watch(()=>form.value,(newForm,oldForm)=>{
    //     newForm.forEach((item,index)=>{
    //         if(item.yarnCode.itemValue!==oldSnapshot[index].yarnCode.itemValue){
    //             form.value[index].yarnId={
    //                 label:'Id',
    //                 itemTitle:item.yarnCode.itemValue2,
    //                 itemValue:item.yarnCode.itemValue2,
    //                 itemValue2:item.yarnCode.itemValue,
    //                 listTitle:item.yarnCode.itemValue2 +' : '+item.yarnCode.itemValue,
    //                 listSubTitle:''
    //             }
    //         }else if(item.yarnId.itemValue!==oldSnapshot[index].yarnId.itemValue){
    //             form.value[index].yarnCode={
    //                 label:'Yarn Code',
    //                 itemTitle:item.yarnId.itemValue2,
    //                 itemValue:item.yarnId.itemValue2,
    //                 itemValue2:item.yarnId.itemValue,
    //                 listTitle:item.yarnId.itemValue2 +' : '+item.yarnId.itemValue,
    //                 listSubTitle:''
    //             }
    //         }
    //     })
    //     oldSnapshot=structuredClone(toRaw(newForm))
    // },{deep:true})
   
    // 👉 Edit data
    const editData=async()=>{
        try{
            const {data}=await $api(`${import.meta.env.BASE_URL}api/fabric/GetItemMasterEdit?code=${props.itemCode}`)
            form.value={
                code: data.code,
                description: data.description ?? '',
                pfCodeName: data.pfCodeName,
                color: data.color ?? '',
                season: data.season ?? '',
                customer: data.customer ?? '',
                model: data.model ?? '',
                unit: data.unit ?? '',
                price: data.price ?? 0,
                workType: data.workType ?? '',
                section: data.section ?? '',
                supplier: data.supplier ?? '',
                codeSub: data.codeSub ?? '',
                labNo: data.labNo ?? '',
                weightGSM: data.weightGSM ?? 0,
                width: data.width ?? 0,
                washing: data.washing ?? 0,
                ph: data.ph ?? 0,
                spirality: data.spirality ?? 0,
                shrinkageL: data.shrinkageL ?? 0,
                shrinkageW: data.shrinkageW ?? 0,
                colorFastness: data.colorFastness ?? 0,
                fabricContent: data.fabricContent ?? '',
                company: data.company ?? '',
                itemType: data.itemType ?? '',
                customerCode: data.customerCode ?? '',
                inputUser: data.inputUser ?? ''
            }
        }
        catch(err){
            console.log(err)
        }
    }
    
    // 👉 Save data
    const saveData = async() => {
        if(!form.value.code){
            toast.warning('Please input item code.<br/>กรุณาระบุ item code')
            return
        }
        if(!form.value.pfCodeName){
            toast.warning('Please input PF code.<br/>กรุณาระบุ PF Code')
            return
        }
        if(!form.value.customerCode) form.value.customerCode=form.value.code
        form.value.inputUser=useCookie<any>('userData').value?.username

        try{
            const res=await $api(`${import.meta.env.BASE_URL}api/fabric/PostItemMasterSave`,{
                method:'POST',
                body:{
                    code:form.value.code,
                    description:form.value.description,
                    pfCodeName:form.value.pfCodeName,
                    color:form.value.color,
                    season:form.value.season,
                    customer:form.value.customer,
                    model:form.value.model,
                    unit:form.value.unit,
                    price:form.value.price,
                    workType:form.value.workType,
                    section:form.value.section,
                    supplier:form.value.supplier,
                    codeSub:form.value.codeSub,
                    labNo:form.value.labNo,
                    weightGSM:form.value.weightGSM,
                    width:form.value.width,
                    washing:form.value.washing,
                    ph:form.value.ph,
                    spirality:form.value.spirality,
                    shrinkageL:form.value.shrinkageL,
                    shrinkageW:form.value.shrinkageW,
                    colorFastness:form.value.colorFastness,
                    fabricContent:form.value.fabricContent,
                    company:form.value.company,
                    itemType:form.value.itemType,
                    customerCode:form.value.customerCode,
                    inputUser:form.value.inputUser
                },
                onResponseError({response}){
                    if(response._data.message){
                        toast.error(response._data.message)
                    }else{
                        toast.error(JSON.stringify(response._data.errors))
                    } 
                }
            })
            toast.success(res.message)
            isDialogVisible.value=false
            isReloadGrid.value=true
        }catch(err){
            console.log(err)
        }
    }

    defineExpose({
        VIconRenderer,
    })

</script>
<template>
    <v-dialog
        :width=" '80%'"
        v-model="isDialogVisible"
    >
        <DialogCloseBtn @click="isDialogVisible=false"/>
        <VCard height="80vh">
            <VCardText class="pa-2">
                <VCard class="border mb-1">
                    <VCardText class="pa-2">
                        <VRow>
                            <VCol cols="12" sm="8" md="5" lg="4" class="pb-1">
                                <VTextField
                                    counter="25"
                                    hint="This field uses maxlength attribute"
                                    label="Code"
                                    maxLength="25"
                                    type="text"
                                    v-model="form.code"
                                    variant="filled"
                                    :rules="rules25"
                                />
                            </VCol>
                            <VCol cols="12" lg="8" class="py-1 pt-lg-3">
                                <VTextField
                                    counter="255"
                                    hint="This field uses maxlength attribute"
                                    label="PF Code"
                                    maxLength="255"
                                    type="text"
                                    v-model="form.pfCodeName"
                                    variant="filled"
                                    :rules="rules255"
                                />
                            </VCol>
                            <VCol cols="12" lg="12" class="pt-1 pb-2">
                                <VTextField
                                    counter="255"
                                    hint="This field uses maxlength attribute"
                                    label="Description"
                                    maxLength="255"
                                    type="text"
                                    v-model="form.description"
                                    variant="filled"
                                    :rules="rules255"
                                />
                            </VCol>
                            
                        </VRow>
                    </VCardText>
                </VCard>
                <VCard class="border">
                    <VCardText class=" pa-2">
                        <VRow>
                            <VCol cols="12" md="9" lg="6" class="pb-1">
                                <VTextField
                                    counter="50"
                                    hint="This field uses maxlength attribute"
                                    label="Color"
                                    maxLength="50"
                                    type="text"
                                    v-model="form.color"
                                    variant="filled"
                                    :rules="rules50"
                                />
                            </VCol>
                            <VCol cols="12" sm="5" md="4" lg="2" class="py-1 pt-lg-3">
                                <VTextField
                                    counter="10"
                                    hint="This field uses maxlength attribute"
                                    label="Season"
                                    maxLength="10"
                                    type="text"
                                    v-model="form.season"
                                    variant="filled"
                                    :rules="rules10"
                                />
                            </VCol>
                            <VCol cols="12" md="10" lg="6"  class="py-1">
                                <VTextField
                                    counter="50"
                                    hint="This field uses maxlength attribute"
                                    label="Customer"
                                    maxLength="50"
                                    type="text"
                                    v-model="form.customer"
                                    variant="filled"
                                    :rules="rules50"
                                />
                            </VCol>
                            <VCol cols="12" md="10" lg="6" class="py-1">
                                <VTextField
                                    counter="50"
                                    hint="This field uses maxlength attribute"
                                    label="Model"
                                    maxLength="50"
                                    type="text"
                                    v-model="form.model"
                                    variant="filled"
                                    :rules="rules50"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" md="3"  class="py-1">
                                <VTextField
                                    counter="10"
                                    hint="This field uses maxlength attribute"
                                    label="Unit"
                                    maxLength="10"
                                    type="text"
                                    v-model="form.unit"
                                    variant="filled"
                                    :rules="rules10"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" md="3"  class="py-1">
                                <VTextField
                                    label="Price"
                                    type="number"
                                    v-model="form.price"
                                    variant="filled"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" md="3"  class="py-1">
                                <VTextField
                                    counter="10"
                                    hint="This field uses maxlength attribute"
                                    label="Work"
                                    maxLength="10"
                                    type="text"
                                    v-model="form.workType"
                                    variant="filled"
                                    :rules="rules10"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" md="3"   class=" py-1">
                                <VTextField
                                    counter="10"
                                    hint="This field uses maxlength attribute"
                                    label="Section"
                                    maxLength="10"
                                    type="text"
                                    v-model="form.section"
                                    variant="filled"
                                    :rules="rules10"
                                />
                            </VCol>
                            <VCol cols="12" class="py-1">
                                <VTextField
                                    counter="255"
                                    hint="This field uses maxlength attribute"
                                    label="Supplier"
                                    maxLength="255"
                                    type="text"
                                    v-model="form.supplier"
                                    variant="filled"
                                    :rules="rules255"
                                />
                            </VCol>
                            <VCol cols="12" class="py-1">
                                <VTextField
                                    counter="100"
                                    hint="This field uses maxlength attribute"
                                    label="Code Sub"
                                    maxLength="100"
                                    type="text"
                                    v-model="form.codeSub"
                                    variant="filled"
                                    :rules="rules100"
                                />
                            </VCol>
                            <VCol cols="12"  class="py-1">
                                <VTextField
                                    counter="100"
                                    hint="This field uses maxlength attribute"
                                    label="Lab No."
                                    maxLength="100"
                                    type="text"
                                    v-model="form.labNo"
                                    variant="filled"
                                    :rules="rules100"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" lg="3"  class="py-1">
                                <VTextField
                                    label="Weight(GSM)"
                                    type="number"
                                    v-model="form.weightGSM"
                                    variant="filled"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" lg="3"  class="py-1">
                                <VTextField
                                    label="Width"
                                    type="number"
                                    v-model="form.width"
                                    variant="filled"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" lg="3" class="py-1">
                                <VTextField
                                    label="Washing"
                                    type="number"
                                    v-model="form.washing"
                                    variant="filled"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" lg="3" class="py-1">
                                <VTextField
                                    label="PH"
                                    type="number"
                                    v-model="form.ph"
                                    variant="filled"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" lg="3" class="py-1">
                                <VTextField
                                    label="Spirality"
                                    type="number"
                                    v-model="form.spirality"
                                    variant="filled"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" lg="3" class="py-1">
                                <VTextField
                                    label="Color Fastness"
                                    type="number"
                                    v-model="form.colorFastness"
                                    variant="filled"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" lg="3"  class="py-1">
                                <VTextField
                                    label="Shrinkage(L)"
                                    type="number"
                                    v-model="form.shrinkageL"
                                    variant="filled"
                                />
                            </VCol>
                            <VCol cols="12" sm="6" lg="3"  class="py-1">
                                <VTextField
                                    label="Shrinkage(W)"
                                    type="number"
                                    v-model="form.shrinkageW"
                                    variant="filled"
                                />
                            </VCol>
                            <VCol cols="12"  class="py-1">
                                <VTextField
                                    counter="255"
                                    hint="This field uses maxlength attribute"
                                    label="Fabric Content"
                                    maxLength="255"
                                    type="text"
                                    v-model="form.fabricContent"
                                    variant="filled"
                                    :rules="rules255"
                                />
                            </VCol>
                            <VCol cols="12" sm="8" md="6" lg="4" class="py-1">
                                <VTextField
                                    counter="25"
                                    hint="This field uses maxlength attribute"
                                    label="Company"
                                    maxLength="25"
                                    type="text"
                                    v-model="form.company"
                                    variant="filled"
                                    :rules="rules25"
                                />
                            </VCol>
                            <VCol cols="12" sm="8" md="6" lg="4"  class="py-1">
                                <VTextField
                                    counter="25"
                                    hint="This field uses maxlength attribute"
                                    label="Type"
                                    maxLength="25"
                                    type="text"
                                    v-model="form.itemType"
                                    variant="filled"
                                    :rules="rules25"
                                />
                            </VCol>
                            <VCol cols="12" sm="8" md="6" lg="4" class=" py-1">
                                <VTextField
                                    counter="25"
                                    hint="This field uses maxlength attribute"
                                    label="Customer Code"
                                    maxLength="25"
                                    type="text"
                                    v-model="form.customerCode"
                                    variant="filled"
                                    :rules="rules25"
                                />
                            </VCol>
                        </VRow>
                    </VCardText>
                </VCard>
            </VCardText>
            <VCardActions>
                <VBtn
                    size="small"
                    color="success"
                    class="ms-auto"
                    variant="outlined"
                    :loading="loadings[0]"
                    :disabled="loadings[0]"
                    @click="saveData()"
                >
                    <VIcon v-if="props.editMode=='add'" start icon="tabler-database-plus" size="22"/>
                    <VIcon v-else start icon="tabler-database-edit" size="22"/>
                    Save
                </VBtn>
            </VCardActions>
        </VCard>
    </v-dialog>
</template>
