<script setup lang="ts">
    import 'vue3-tree-vue/dist/style.css'
    import tree from 'vue3-tree-vue'
    import { VTreeview } from 'vuetify/labs/components';

    definePage({
        meta:{
            action:'read',
            subject:'fabric-registration'
        }
    })

    interface TreeViewItem {
        name: string;
        id?: string | number;
        children?: TreeViewItem[];
        checked?: boolean;
        selected?: boolean;
        expanded?: boolean;
        disableDragAndDrop?: boolean; // Disable drag and drop for a specific node.
        disabled?: boolean;// When disabled, an item can neither be selected nor checked
        meta?: any;// provides meta-data of any type per node.
    }

    const items=ref<TreeViewItem[]>([])
    const root= "\\\\Domain\\FabricRegistration\\Registration"
    const res=await $api(`${import.meta.env.BASE_URL}api/fabric/fabricregistration?path=${root}&isroot=true`)
    const rootObject=JSON.parse(res)
    items.value.push(...rootObject.directory,...rootObject.file)

    // const onItemSelected=(item:TreeViewItem)=>{
    //     console.log(item)
    // }

    // const onItemExpanded=async (expandedItem:TreeViewItem)=>{
    //     const res=await $api(`${import.meta.env.BASE_URL}api/fabric/fabricregistration?path=${expandedItem.meta.path}&isroot=false`)
    //     const lazyLoadedItems=JSON.parse(res)
    //     expandedItem.children?.push(...lazyLoadedItems.directory,...lazyLoadedItems.file)
    // }

    //const initiallyOpen=ref(['public'])//ref(['\\\\Domain\\FabricRegistration\\Registration\\Regis 2012'])
    /* const extensions=ref({
        pdf:'tabler-file-type-pdf',
        xlsx:'tabler-file-excel',
        xls:'tabler-file-type-xls',
        docx:'tabler-file-type-docx',
        doc:'tabler-file-type-doc',
        txt:'tabler-file-type-txt',
        png:'tabler-file-type-png',
        bmp:'tabler-file-type-bmp',
        jpg:'tabler-file-type-jpg',
        gif:'tabler-photo',
        rar:'tabler-zip',
        zip:'tabler-zip',
        '7z':'tabler-zip'
    }) */

    const items2=ref([
        {
          id: 1,
          title: 'Applications :',
          children: [
            { id: 2, title: 'Calendar : app' },
            { id: 3, title: 'Chrome : app' },
            { id: 4, title: 'Webstorm : app' },
          ],
        },
        {
          id: 5,
          title: 'Documents :',
          children: [
            {
              id: 6,
              title: 'vuetify :',
              children: [
                {
                  id: 7,
                  title: 'src :',
                  children: [
                    { id: 8, title: 'index : ts' },
                    { id: 9, title: 'bootstrap : ts' },
                  ],
                },
              ],
            },
            {
              id: 10,
              title: 'material2 :',
              children: [
                {
                  id: 11,
                  title: 'src :',
                  children: [
                    { id: 12, title: 'v-btn : ts' },
                    { id: 13, title: 'v-card : ts' },
                    { id: 14, title: 'v-window : ts' },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: 15,
          title: 'Downloads :',
          children: [
            { id: 16, title: 'October : pdf' },
            { id: 17, title: 'November : pdf' },
            { id: 18, title: 'Tutorial : html' },
          ],
        },
        {
          id: 19,
          title: 'Videos :',
          children: [
            {
              id: 20,
              title: 'Tutorials :',
              children: [
                { id: 21, title: 'Basic layouts : mp4' },
                { id: 22, title: 'Advanced techniques : mp4' },
                { id: 23, title: 'All about app : dir' },
              ],
            },
            { id: 24, title: 'Intro : mov' },
            { id: 25, title: 'Conference introduction : avi' },
          ],
        },
      ])

      const openNode=async (opened:any)=>{
        if(opened.value){
            const item=items.value.find(x=>x.id===opened.id)
            console.log(item)
            if(item?.children?.length===0){
                const res=await $api(`${import.meta.env.BASE_URL}api/fabric/fabricregistration?path=${item?.meta.path}&isroot=false`)
                const lazyLoadedItems=JSON.parse(res)
                const index=items.value.findIndex(x=>x.id===opened.id)
                items.value[index].children?.push(...lazyLoadedItems.directory,...lazyLoadedItems.file)
            }
        }
      }
</script>
<template>
    <VCard
        title="Fabric Registration"
        subtitle="Browse files"
    >
        <VCardText>
            <v-treeview 
                :items="items"
                item-title="name"
                item-value="id"
                color="warning"
                density="compact"
                @click:open="openNode"
                collapse-icon="tabler-chevron-down"
                expand-icon="tabler-chevron-right"
            >
                <template 
                    v-slot:prepend="{item,isActive}">
                    <v-icon v-if="item.children" :icon="isActive?'tabler-folder-open':'tabler-folder'"></v-icon>
                    <v-icon v-else icon="tabler-file"></v-icon>
                </template>
            </v-treeview>
            <!-- <tree
                :items="items"
                :isCheckable="false"
                :hideGuideLines="false"
                :lazyLoad="true"
                @onSelect="onItemSelected"
                @onExpand="onItemExpanded"

            >
                <template #item-prepend-icon="treeViewItem">
                    <VIcon
                        v-if="treeViewItem.meta?.type==='folder'"
                        icon="tabler-folder"
                        class="text-warning"
                    />
                    <VIcon
                        v-else
                        icon="tabler-file-text"
                    />
                </template>
            </tree> -->
        </VCardText>
    </VCard>
    
    
   
    
</template>
