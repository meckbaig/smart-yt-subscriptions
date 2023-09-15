<template>
   <div class="p-2 m-2">
      <div v-if="store.state.user">
         <div class="d-flex flex-row justify-content-between">
            <h3>Ваши папки:</h3>
            <button @click="createFolder" class="btn btn-secondary">+ Добавить папку</button>
         </div>
         <div class="d-flex flex-row my-2 align-self-start flex-wrap gap-2">
            <folder-item v-for="folder in store.state.folders" :id="folder.id" :name="folder.name" :color="folder.color"
               :icon="folder.icon" :channelsCount="folder.channelsCount" :editable="true" style="max-width: 180px;" />
         </div>
         <hr>
      </div>
      <h3 class="mb-3">Папки в открытом доступе:</h3>
      <div class="d-flex flex-row my-2 align-self-start flex-wrap gap-2">
            <folder-item v-if="store.state.publicFolders.length" v-for="folder in store.state.publicFolders" :id="folder.id" :name="folder.name" :color="folder.color"
               :icon="folder.icon" :channelsCount="folder.channelsCount" :editable="false" style="max-width: 180px;" />
         </div>
   </div>
</template>

<script setup>
import { isLightTheme, reverseTheme, sleep } from "../main";
import * as connections from "../connections";
import draggable from 'vuedraggable';
import { computed, onMounted, ref } from 'vue'
import FolderItem from "../components/FolderItem.vue";
import { deepUnref } from 'vue-deepunref';
import store from '../store'
import * as googleAuth from '../googleAuth'

onMounted(() => {
   if (!store.state.publicFolders.length){
      let userId = ""
      if (store.state.user.id) {
         userId = store.state.user.id
      }
      store.dispatch("setPublicFolders", userId)
   }
})


async function createFolder() {
   new Promise((resolve, reject) => {
      store.dispatch("createFolder", { "id": store.state.user.id, "name": "New folder 1" });
      resolve();
   }).then(() => {
      // let subscribe = store.subscribe((mutation, state) => {
      //    let folder = store.state.folders[store.state.folders.length - 1]
      //    router.push({
      //       name: "folder",
      //       params: { "folder": folder.id }
      //    })
      //    subscribe()
      //})


      // let folder = store.state.folders[store.state.folders.length - 1]
      // let id = folder.id
      // router.push({
      //    name: "folder",
      //    params: { "folder": folder.id }  
      // })
   })
}
</script>