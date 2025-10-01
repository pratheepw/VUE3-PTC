<script setup lang="ts">
    import DialogCloseBtn from '@/@core/components/DialogCloseBtn.vue';
    import VIconRenderer from '@/components/ag-grid/VIconRenderer.vue';
    import {toast,type ToastOptions} from 'vue3-toastify'
    import { useCookie } from '@/@core/composable/useCookie';

    interface AutocompleteData{
        label:string
        itemTitle:string
        itemValue:string
        itemValue2:string //ใช้ในกรณีให้คืนค่าไปใน Object อื่นหลังจากเลือก autocomplete
        listTitle:string
        listSubTitle:string
    }
    interface yarn{
        yarnCode:AutocompleteData
        yarnId:AutocompleteData
        percentUse:number
        loss:number
    }

    const isDialogVisible=defineModel<boolean>('isDialogVisible',{required:true})
    const props=defineProps({
        editMode:String,
        fabricCode:String
    })

    // 👉 Declare variable
    const rules=[(v:string)=>v.length<=50||'Max 50 characters']
    const loadings=ref<boolean[]>([])
    const fabricCode=ref('')
    const weightPerPcs=ref<number>()
    const section=ref('')
    const sectionList=[
        'Inter',
        'Parfun',
        'PIPAT',
        'Riki Garments',
        'SAI4',
        'Sales1',
        'Sales2',
        'Sales3',
        'Sales4',
        'Sales5',
        'Sales6',
        'Sales7',
        'Thai Parfun',
        'Thai Parfun (304)',
        'Thai Parfun (Uniqlo)',
        'Yeh Parfun'
    ]
    const defaultForm:yarn[]=[
        {
            yarnCode:{
                label:'Yarn Code',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            yarnId:{
                label:'Id',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            percentUse:0,
            loss:3
        },
        {
            yarnCode:{
                label:'Yarn Code',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            yarnId:{
                label:'Id',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            percentUse:0,
            loss:3
        },
        {
            yarnCode:{
                label:'Yarn Code',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            yarnId:{
                label:'Id',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            percentUse:0,
            loss:3
        },
        {
            yarnCode:{
                label:'Yarn Code',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            yarnId:{
                label:'Id',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            percentUse:0,
            loss:3
        },
        {
            yarnCode:{
                label:'Yarn Code',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            yarnId:{
                label:'Id',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            percentUse:0,
            loss:3
        },
        {
            yarnCode:{
                label:'Yarn Code',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            yarnId:{
                label:'Id',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            percentUse:0,
            loss:3
        },
        {
            yarnCode:{
                label:'Yarn Code',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            yarnId:{
                label:'Id',
                itemTitle:'',
                itemValue:'',
                itemValue2:'',
                listTitle:'',
                listSubTitle:''
            },
            percentUse:0,
            loss:3
        },
    ]
    const form=ref(defaultForm.map(x=>({...x})))
    let oldSnapshot=structuredClone(toRaw( form.value))

    // 👉 Clear form
    const clearForm=()=>{
        fabricCode.value=''
        weightPerPcs.value=0
        section.value=''
        form.value=defaultForm.map(x=>({...x}))
        oldSnapshot=structuredClone(toRaw(form.value))
    }
    
    watchEffect(()=>{
        if(props.editMode=='add'){
            clearForm()
        }else if(props.fabricCode){
            clearForm()
            editData()
        }
    })

    // 👉 Watch form changes
    watch(()=>form.value,(newForm,oldForm)=>{
        newForm.forEach((item,index)=>{
            if(item.yarnCode.itemValue!==oldSnapshot[index].yarnCode.itemValue){
                form.value[index].yarnId={
                    label:'Id',
                    itemTitle:item.yarnCode.itemValue2,
                    itemValue:item.yarnCode.itemValue2,
                    itemValue2:item.yarnCode.itemValue,
                    listTitle:item.yarnCode.itemValue2 +' : '+item.yarnCode.itemValue,
                    listSubTitle:''
                }
            }else if(item.yarnId.itemValue!==oldSnapshot[index].yarnId.itemValue){
                form.value[index].yarnCode={
                    label:'Yarn Code',
                    itemTitle:item.yarnId.itemValue2,
                    itemValue:item.yarnId.itemValue2,
                    itemValue2:item.yarnId.itemValue,
                    listTitle:item.yarnId.itemValue2 +' : '+item.yarnId.itemValue,
                    listSubTitle:''
                }
            }
        })
        oldSnapshot=structuredClone(toRaw(newForm))
    },{deep:true})
   
    // 👉 Edit data
    const editData=async()=>{
        try{
            const {master,detail}=await $api(`${import.meta.env.BASE_URL}api/fabric/GetFabricIngredientEdit?code=${props.fabricCode}`)
            fabricCode.value=master.fabricCode
            weightPerPcs.value=master.weightPerPcs
            section.value=master.section
            // // Yarn1
            // const yarnCode1:AutocompleteData={
            //     label:'Yarn Code',
            //     itemTitle:detail[0].yarnCode,
            //     itemValue:detail[0].yarnCode,
            //     itemValue2:'',
            //     listTitle:detail[0].yarnId +' : '+detail[0].yarnCode,
            //     listSubTitle:''
            // }
            // const yarnId1:AutocompleteData={
            //     label:'Id',
            //     itemTitle:detail[0].yarnId,
            //     itemValue:detail[0].yarnId,
            //     itemValue2:'',
            //     listTitle:detail[0].yarnId +' : '+detail[0].yarnCode,
            //     listSubTitle:''
            // }
            // form.value[0].yarnCode=yarnCode1
            // form.value[0].yarnId=yarnId1,
            // form.value[0].percentUse=detail[0].percentUse
            // form.value[0].loss=detail[0].loss

            detail.forEach((x:any,index:number)=>{
                
                form.value[index].yarnCode={
                    label:'Yarn Code',
                    itemTitle:detail[index].yarnCode,
                    itemValue:detail[index].yarnCode,
                    itemValue2:detail[index].yarnId,
                    listTitle:detail[index].yarnId +' : '+detail[index].yarnCode,
                    listSubTitle:''
                }
                form.value[index].yarnId={
                    label:'Id',
                    itemTitle:detail[index].yarnId,
                    itemValue:detail[index].yarnId,
                    itemValue2:detail[index].yarnCode,
                    listTitle:detail[index].yarnId +' : '+detail[index].yarnCode,
                    listSubTitle:''
                }
                form.value[index].yarnId.itemValue=detail[index].yarnId
                form.value[index].percentUse=detail[index].percentUse
                form.value[index].loss=detail[index].loss
            })
        }
        catch(err){
            console.log(err)
        }
    }
    
    // 👉 Save data
    const saveData = async() => {
        if(!fabricCode.value){
            toast.warning('Please input fabric code')
            return
        }
        try{
            const ingredients=form.value.filter(x=>x.yarnCode.itemValue && x.yarnId.itemValue).map(x=>({
                yarnCode:x.yarnCode.itemValue,
                yarnId:x.yarnId.itemValue,
                percentUse:x.percentUse,
                loss:x.loss
            }))
            const res=await $api(`${import.meta.env.BASE_URL}api/fabric/PostFabricIngredientSave`,{
                method:'POST',
                body:{
                    fabricCode:fabricCode.value,
                    weightPerPcs:weightPerPcs.value,
                    section:section.value,
                    ingredients:ingredients,
                    userName:useCookie<any>('userData').value?.username
                },
                onResponseError({response}){
                    if(response._data.message){
                        const m=response._data.message.split('|')
                        toast.error(`<b>${m[0]}</b><br/>${m[1]}`)
                    }else{
                        toast.error(JSON.stringify(response._data.errors))
                    } 
                }
            })
            toast.success(res.message)
            isDialogVisible.value=false
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
                    <VCardText class=" pa-2">
                        <VRow>
                            <VCol cols="12" lg="7">
                                <VTextField
                                    counter="50"
                                    hint="This field uses maxlength attribute"
                                    label="Fabric Code"
                                    maxLength="50"
                                    v-model="fabricCode"
                                    variant="outlined"
                                    :rules="rules"
                                />
                            </VCol>
                            <VCol cols="12" sm="4" lg="2">
                                <VTextField
                                    label="Weight/Pcs"
                                    v-model="weightPerPcs"
                                    variant="outlined"
                                />
                            </VCol>
                            <VCol cols="12" sm="8" lg="3">
                                <VSelect
                                    label="Section"
                                    v-model="section"
                                    variant="outlined"
                                    :items="sectionList"
                                />
                            </VCol>
                        </VRow>
                    </VCardText>
                </VCard>
                <VCard class="border">
                    <VCardText class=" pa-2">
                        <!--Yarn1-->
                        <VRow>
                            <VCol cols="3" sm="2" md="1" class="d-flex align-content-center pb-md-1">
                                <label 
                                    class="v-label text-body-2 text-high-emphasis"
                                >Yarn1</label>
                            </VCol>
                            <VCol cols="9" sm="10" md="5" lg="5" xl="8" class=" pb-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarncode'"
                                    v-model:selected-item="form[0].yarnCode"
                                />
                            </VCol>
                            <VCol cols="4" md="2" xl="1" class=" offset-sm-2 offset-md-0 pb-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarnid'"
                                    v-model:selected-item="form[0].yarnId"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" pb-md-1">
                                <VTextField
                                    label="Use%"
                                    type="number"
                                    v-model="form[0].percentUse"
                                    variant="outlined"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" pb-md-1">
                                <VTextField
                                    label="Loss"
                                    type="number"
                                    v-model="form[0].loss"
                                    variant="outlined"
                                />
                            </VCol>
                        </VRow>
                        <!--Yarn2-->
                        <VRow>
                            <VCol cols="3" sm="2" md="1" class="d-flex align-content-center py-md-1">
                                <label 
                                    class="v-label text-body-2 text-high-emphasis"
                                >Yarn2</label>
                            </VCol>
                            <VCol cols="9" sm="10" md="5" lg="5" xl="8" class=" py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarncode'"
                                    v-model:selected-item="form[1].yarnCode"
                                />
                            </VCol>
                            <VCol cols="4" md="2" xl="1" class=" offset-sm-2 offset-md-0 py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarnid'"
                                    v-model:selected-item="form[1].yarnId"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Use%"
                                    type="number"
                                    v-model="form[1].percentUse"
                                    variant="outlined"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Loss"
                                    type="number"
                                    v-model="form[1].loss"
                                    variant="outlined"
                                />
                            </VCol>
                        </VRow>
                        <!--Yarn3-->
                        <VRow>
                            <VCol cols="3" sm="2" md="1" class="d-flex align-content-center py-md-1">
                                <label 
                                    class="v-label text-body-2 text-high-emphasis"
                                >Yarn3</label>
                            </VCol>
                            <VCol cols="9" sm="10" md="5" lg="5" xl="8" class=" py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarncode'"
                                    v-model:selected-item="form[2].yarnCode"
                                />
                            </VCol>
                            <VCol cols="4" md="2" xl="1" class=" offset-sm-2 offset-md-0 py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarnid'"
                                    v-model:selected-item="form[2].yarnId"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Use%"
                                    type="number"
                                    v-model="form[2].percentUse"
                                    variant="outlined"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Loss"
                                    type="number"
                                    v-model="form[2].loss"
                                    variant="outlined"
                                />
                            </VCol>
                        </VRow>
                        <!--Yarn4-->
                        <VRow>
                            <VCol cols="3" sm="2" md="1" class="d-flex align-content-center py-md-1">
                                <label 
                                    class="v-label text-body-2 text-high-emphasis"
                                >Yarn4</label>
                            </VCol>
                            <VCol cols="9" sm="10" md="5" lg="5" xl="8" class=" py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarncode'"
                                    v-model:selected-item="form[3].yarnCode"
                                />
                            </VCol>
                            <VCol cols="4" md="2" xl="1" class=" offset-sm-2 offset-md-0 py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarnid'"
                                    v-model:selected-item="form[3].yarnId"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Use%"
                                    type="number"
                                    v-model="form[3].percentUse"
                                    variant="outlined"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Loss"
                                    type="number"
                                    v-model="form[3].loss"
                                    variant="outlined"
                                />
                            </VCol>
                        </VRow>
                        <!--Yarn5-->
                        <VRow>
                            <VCol cols="3" sm="2" md="1" class="d-flex align-content-center py-md-1">
                                <label 
                                    class="v-label text-body-2 text-high-emphasis"
                                >Yarn5</label>
                            </VCol>
                            <VCol cols="9" sm="10" md="5" lg="5" xl="8" class=" py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarncode'"
                                    v-model:selected-item="form[4].yarnCode"
                                />
                            </VCol>
                            <VCol cols="4" md="2" xl="1" class=" offset-sm-2 offset-md-0 py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarnid'"
                                    v-model:selected-item="form[4].yarnId"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Use%"
                                    type="number"
                                    v-model="form[4].percentUse"
                                    variant="outlined"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Loss"
                                    type="number"
                                    v-model="form[4].loss"
                                    variant="outlined"
                                />
                            </VCol>
                        </VRow>
                        <!--Yarn6-->
                        <VRow>
                            <VCol cols="3" sm="2" md="1" class="d-flex align-content-center py-md-1">
                                <label 
                                    class="v-label text-body-2 text-high-emphasis"
                                >Yarn6</label>
                            </VCol>
                            <VCol cols="9" sm="10" md="5" lg="5" xl="8" class=" py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarncode'"
                                    v-model:selected-item="form[5].yarnCode"
                                />
                            </VCol>
                            <VCol cols="4" md="2" xl="1" class=" offset-sm-2 offset-md-0 py-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarnid'"
                                    v-model:selected-item="form[5].yarnId"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Use%"
                                    type="number"
                                    v-model="form[5].percentUse"
                                    variant="outlined"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" py-md-1">
                                <VTextField
                                    label="Loss"
                                    type="number"
                                    v-model="form[5].loss"
                                    variant="outlined"
                                />
                            </VCol>
                        </VRow>
                        <!--Yarn7-->
                        <VRow>
                            <VCol cols="3" sm="2" md="1" class="d-flex align-content-center pt-md-1">
                                <label 
                                    class="v-label text-body-2 text-high-emphasis"
                                >Yarn7</label>
                            </VCol>
                            <VCol cols="9" sm="10" md="5" lg="5" xl="8" class=" pt-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarncode'"
                                    v-model:selected-item="form[6].yarnCode"
                                />
                            </VCol>
                            <VCol cols="4" md="2" xl="1" class=" offset-sm-2 offset-md-0 pt-md-1">
                                <TextAutoComplete
                                    :api-url="'api/fabric/GetFabricIngredientAutocomplete'"
                                    :field="'yarnid'"
                                    v-model:selected-item="form[6].yarnId"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" pt-md-1">
                                <VTextField
                                    label="Use%"
                                    type="number"
                                    v-model="form[6].percentUse"
                                    variant="outlined"
                                />
                            </VCol>
                            <VCol md="2" xl="1" class=" pt-md-1">
                                <VTextField
                                    label="Loss"
                                    type="number"
                                    v-model="form[6].loss"
                                    variant="outlined"
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
                    <VIcon start icon="tabler-device-floppy"/>
                    Save
                </VBtn>
            </VCardActions>
        </VCard>
    </v-dialog>
</template>
