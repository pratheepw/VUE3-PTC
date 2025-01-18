<script setup lang="ts">
  import DropDownFloatingFilter from '@/components/ag-grid/DropDownFloatingFilter.vue'
  import userListWithAvatarRenderer from '@/views/user-list/user-list-with-avatar-renderer.vue'
  import VChipRenderer from '@/components/ag-grid/VChipRenderer.vue'
  import AgGrid from '@/components/ag-grid/AgGrid.vue'
  import VIconWithTextRenderer from '@/components/ag-grid/VIconWithTextRenderer.vue'

  definePage({
    meta:{
      action:'read',
      subject:'user-list'
    }
  })

  const widgetData =ref([
    { title: 'Total Users',value:0, icon: 'tabler-users', iconColor: 'primary' },
    { title: 'Active Users',value:0, icon: 'tabler-user-check', iconColor: 'success' },
    { title: 'Pending Users',value:0, icon: 'tabler-user-exclamation', iconColor: 'warning' },
  ])

  // 👉 Fetching users
  const {data,totalUser,activeUser,pendingUser} = await $api<any>(`${import.meta.env.BASE_URL}api/user/getusers`)
    widgetData.value[0].value=totalUser
    widgetData.value[1].value=activeUser
    widgetData.value[2].value=pendingUser

  // 👉 agGrid
  //const gridApi=shallowRef()
  
  const columnDefs = ref([
    {field:'userId',hide:true},
    {field:'employeeId',hide:true},
    {field:'firstName',hide:true},
    {field:'lastName',hide:true},
    {field:'photo',hide:true},
    {field:'roles',hide:true},
    { field: "email",
      cellRenderer:'userListWithAvatarRenderer',
      filter:true,floatingFilter:true 
    },
    
    { 
      field:'gender',
      cellRenderer:'VIconWithTextRenderer',
      cellRendererParams:{
        values:[
          {color:'info',icon:'tabler-gender-male',text:'male',value:'M'},
          {color:'#E91E63',icon:'tabler-gender-female',text:'female',value:'F'},
          {color:'secondary',icon:'',text:'',value:''}
        ]
      },
      filter:'agTextColumnFilter',
      filterParams:{
        filterOptions: ["equals"],
        maxNumConditions: 1
      },
      floatingFilter:true,
      floatingFilterComponent:'DropDownFloatingFilter',
      floatingFilterComponentParams:{
        values: [
          { 'text': 'All', 'value': '' }, 
          { 'text': 'Male', 'value': 'M' }, 
          { 'text': 'Female', 'value': 'F' }]
      },
      suppressFloatingFilterButton:true,
    },
    { 
      field:'position',
      filter:'agTextColumnFilter',
      filterParams:{
        filterOptions: ["equals"],
        maxNumConditions: 1
      },
      floatingFilter:true,
      floatingFilterComponent:'DropDownFloatingFilter',
      floatingFilterComponentParams:{
        values: [
          { "text": "All", "value": "" },
          { "text": "Worker", "value": "Worker" },
          { "text": "Staff", "value": "Staff" },
          { "text": "LL", "value": "LL" },
          { "text": "ASV", "value": "ASV" },
          { "text": "SV", "value": "SV" },
          { "text": "ASC", "value": "ASC" },
          { "text": "SC", "value": "SC" },
          { "text": "SMGR", "value": "SMGR" },
          { "text": "ADMGR", "value": "ADMGR" },
          { "text": "DMGR", "value": "DMGR" },
          { "text": "Director", "value": "Director" }]
      },
      suppressFloatingFilterButton:true,
    },
    { 
      field:'department',
      filter:'agTextColumnFilter',
      filterParams:{
        filterOptions: ["equals"],
        maxNumConditions: 1
      },
      floatingFilter:true,
      floatingFilterComponent:'DropDownFloatingFilter',
      floatingFilterComponentParams:{
        values: [
          { "text": "All", "value": "" },
          { "text": "Account", "value": "Account" },
          { "text": "Dyeing", "value": "Dyeing" },
          { "text": "Exim", "value": "Exim" },
          { "text": "Fabric Sales (Japan)", "value":"Fabric Sales (Japan)"},
          { "text": "Factory 1", "value": "Factory 1" },
          { "text": "Factory 2", "value": "Factory 2" },
          { "text": "Factory 3", "value": "Factory 3" },
          { "text": "HR&Admin", "value": "HR&Admin" },
          { "text": "Knitting", "value": "Knitting" },
          { "text": "Sales1", "value": "Sales1" },
          { "text": "Sales2", "value": "Sales2" },
          { "text": "Sales3", "value": "Sales3" },
          { "text": "Sales4", "value": "Sales4" },
          { "text": "Sales5", "value": "Sales5" },
          { "text": "Setting", "value": "Setting" },
          { "text": "SLL", "value": "SLL" },
          { "text": "System", "value": "System" },
          { "text": "Thai Parfun", "value": "Thai Parfun" },
          { "text": "TPiCS", "value": "TPiCS" }]
      },
      suppressFloatingFilterButton:true,
    },
    {
      headerName:'Verified',field:"emailConfirmed",
      filter:true,floatingFilter:true,
      cellRenderer:'VChipRenderer',
      cellRendererParams:{
        values:[
          {color:'success',text:'verified',value:true},
          {color:'warning',text:'pending',value:false}
        ]
      }
    },
    {
      headerName:'Status',field:'active',
      filter:true,floatingFilter:true,
      cellRenderer:'VChipRenderer',
      cellRendererParams:{
        values:[
          {color:'success',text:'active',value:true},
          {color:'secondary',text:'inactive',value:false}
        ]
      }
    }
  ])
  
  defineExpose({
    DropDownFloatingFilter,
    VChipRenderer,
    VIconWithTextRenderer,
    userListWithAvatarRenderer
  })
</script>

<template>
  <section>
    <!-- 👉 Widgets -->
    <div class="d-flex mb-3">
      <VRow>
        <template v-for="(data, id) in widgetData" :key="id">
          <VCol cols="12" md="3" sm="6">
            <VCard>
              <VCardText class="pa-4">
                <div class="d-flex justify-space-between">
                  <div class="d-flex flex-column gap-y-1">
                    <div class="text-body-1 text-high-emphasis">
                      {{ data.title }}
                    </div>
                    <div class="d-flex gap-x-2 align-center">
                      <h4 class="text-h4">
                        {{ data.value }}
                      </h4>
                    </div>
                  </div>
                  <VAvatar
                    :color="data.iconColor"
                    variant="tonal"
                    rounded
                    size="42"
                  >
                    <VIcon :icon="data.icon" size="26" />
                  </VAvatar>
                </div>
              </VCardText>
            </VCard>
          </VCol>
        </template>
      </VRow>
    </div>
    <VCard class="mb-6">
      <!-- The AG Grid component -->
      <AgGrid
        :columnDefs="columnDefs"
        :rowData="data"
        :row-height=50
        style="height: 500px"
      />
    </VCard>

  </section>
  
</template>
