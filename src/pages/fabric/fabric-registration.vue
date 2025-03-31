<script setup lang="ts">
  import tree from 'vue3-treeview'
  import '@styles/vue3-treeview.css'
  import { useMyStore } from '@/stores/my'
  //import "vue3-treeview/dist/style.css"
    

    definePage({
        meta:{
            action:'read',
            subject:'fabric-registration'
        }
    })

    // 👉 Set current page title
    const myStore=useMyStore()
    myStore.currentPageTitle='Fabric / Fabric Registration'

    const nodes2=ref({})
    const config2=ref({
      roots:[],
      leaves:['fakeid'],
      openedIcon:{
          type:'class',
          class:'tabler-folder-open me-2 text-warning',
          style:'height: 22px; width: 22px;cursor:pointer;'
        },
        closedIcon:{
          type:'class',
          class:'tabler-folder me-2 text-warning',
          style:'height: 22px; width: 22px;cursor:pointer;'
        },
        focusClass:'text-primary'
    })

    const root= "\\\\Domain\\FabricRegistration\\Registration"
    const res=await $api(`${import.meta.env.BASE_URL}api/fabric/fabricregistration?path=${root}&isroot=true`)
    const rootObject=JSON.parse(res)
    rootObject.directory.forEach((d:any)=>{
        nodes2.value[d.id]={
          text:d.name,
          path:d.meta.path,
          children:['fakeid']
        }
        config2.value.roots.push(d.id)
    })

    const addServerNode=async (n:any)=>{
        if(n.children.length>1) return
        n.state.isLoading=true

        console.log(n)
        const res=await $api(`${import.meta.env.BASE_URL}api/fabric/fabricregistration?path=${n.path}&isroot=false`)
        const lazyLoadedItems=JSON.parse(res)
        lazyLoadedItems.directory.forEach((d:any)=>{
          const id=d.id
          const newNode={
            text:d.name,
            path:d.meta.path,
            children:[],
            state:{}
          }
          nodes2.value[id]=newNode
          n.children.push(id)
        })
        lazyLoadedItems.file.forEach((f:any)=>{
          const id=f.id
          const newNode={
            text:f.name,
            path:f.meta.path,
            extension:f.meta.extension,
            state:{}
          }
          nodes2.value[id]=newNode
          n.children.push(id)
          config2.value.leaves.push(id)
        })

        console.log(nodes2.value)
        n.state.isLoading=false
    }

    const downloadFile=async (n:any)=>{
        try {
          const res=await $api(`${import.meta.env.BASE_URL}api/file/download?filename=${n.text}&filepath=${n.path}&fileextension=${n.extension}`)
          const url=window.URL.createObjectURL(res)
          const link=document.createElement('a')
          link.href=url
          link.setAttribute('download',n.text)
          document.body.appendChild(link)
          link.click()
          link.remove()

          setTimeout(()=>{
            window.URL.revokeObjectURL(url)
          },100)
        } catch (error) {
          console.log(error)
        }

    }

    const extensionData=ref([
      {name:'.pdf',icon:'tabler-file-type-pdf',color:'error'},
      {name:'.xlsx',icon:'tabler-file-excel',color:'success'},
      {name:'.xls',icon:'tabler-file-type-xls',color:'success'},
      {name:'.docx',icon:'tabler-file-type-docx',color:'info'},
      {name:'.doc',icon:'tabler-file-type-doc',color:'info'},  
      {name:'.txt',icon:'tabler-file-type-txt',color:'secondary'},  
      {name:'.png',icon:'tabler-file-type-png',color:'#E91E63'},  
      {name:'.bmp',icon:'tabler-file-type-bmp',color:'#E91E63'},  
      {name:'.jpg',icon:'tabler-file-type-jpg',color:'#E91E63'},
      {name:'.gif',icon:'tabler-photo',color:'#009688'},
      {name:'.rar',icon:'tabler-zip',color:'#795548'},  
      {name:'.zip',icon:'tabler-zip',color:'#795548'},
      {name:'.7z',icon:'tabler-zip',color:'#795548'}        
    ])

    const extensions=ref({
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
    }) 

      // const config= ref( {
      //   roots: ["id1", "id2"],
      //   openedIcon:{
      //     type:'class',
      //     class:'tabler-chevron-down'
      //   },
      //   closedIcon:{
      //     type:'class',
      //     class:'tabler-chevron-right'
      //   },
      // })

      // const nodes=ref({
      //   id1: {
      //     text: "text1",
      //     children: ['fakeid'],
      //   },
      //   id11: {
      //     text: "text11",
      //   },
      //   id12: {
      //     text: "text12",
      //   },
      //   id2: {
      //     text: "text2",
      //   },
      // })

      // interface TreeViewItem {
    //     name: string;
    //     id?: string | number;
    //     children?: TreeViewItem[];
    //     checked?: boolean;
    //     selected?: boolean;
    //     expanded?: boolean;
    //     disableDragAndDrop?: boolean; // Disable drag and drop for a specific node.
    //     disabled?: boolean;// When disabled, an item can neither be selected nor checked
    //     meta?: any;// provides meta-data of any type per node.
    // }
</script>
<template>
    <VCard
        title="Fabric Registration"
        subtitle="Browse files"
    >
        <VCardText>
            <tree 
              :nodes="nodes2" 
              :config="config2"
              @nodeOpened="addServerNode"
              @nodeFocus="downloadFile"
            >
              <template #before-input="props">
                <VIcon v-if="props.node.extension"
                  :icon="extensionData.find(e=>e.name==props.node.extension)?.icon"
                  :color="extensionData.find(e=>e.name==props.node.extension)?.color"
                  class="mb-2"
                  style="left:-10px;"
                />
              </template>
            </tree>
        </VCardText>
    </VCard>
    
    
   
    
</template>
<style scoped>
   /* .progress {
  position: relative;
  height: 4px;
  display: block;
  width: 100%;
  background-color: #aab6fe;
  border-radius: 2px;
  background-clip: padding-box;
  margin: 0.5rem 0 1rem 0;
  overflow: hidden;
}
.progress .indeterminate {
  background-color: #3f51b5;
}
.progress .indeterminate:before {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395)
    infinite;
  animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
}
.progress .indeterminate:after {
  content: "";
  position: absolute;
  background-color: inherit;
  top: 0;
  left: 0;
  bottom: 0;
  will-change: left, right;
  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1)
    infinite;
  -webkit-animation-delay: 1.15s;
  animation-delay: 1.15s;
}

@-webkit-keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@keyframes indeterminate {
  0% {
    left: -35%;
    right: 100%;
  }
  60% {
    left: 100%;
    right: -90%;
  }
  100% {
    left: 100%;
    right: -90%;
  }
}
@-webkit-keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
}
@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  100% {
    left: 107%;
    right: -8%;
  }
} */

</style>
