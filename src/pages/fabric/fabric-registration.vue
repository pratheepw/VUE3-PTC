<script setup lang="ts">
    import 'vue3-tree-vue/dist/style.css'
    import tree from 'vue3-tree-vue'

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

    const onItemSelected=(item:TreeViewItem)=>{
        console.log(item)
    }

    const onItemExpanded=async (expandedItem:TreeViewItem)=>{
        const res=await $api(`${import.meta.env.BASE_URL}api/fabric/fabricregistration?path=${expandedItem.meta.path}&isroot=false`)
        const lazyLoadedItems=JSON.parse(res)
        expandedItem.children?.push(...lazyLoadedItems.directory,...lazyLoadedItems.file)
    }

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

</script>
<template>
    <VCard
        title="Fabric Registration"
        subtitle="Browse files"
    >
        <VCardText>
            <tree
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
            </tree>
        </VCardText>
    </VCard>
    
    
   
    
</template>
