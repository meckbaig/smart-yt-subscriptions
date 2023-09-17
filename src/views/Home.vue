<template>
   <div class="p-2 m-2">
      <div v-if="store.state.user">
         <span v-if="warning != ''" class="mx-auto mb-3">
            <h3 class="text-danger">Внимание!</h3>
            <p class="text-danger my-1">Требования для использования сервиса:</p>
            <p class="text-danger my-1">1) На аккаунт Google должен быть зарегистрирован профиль YouTube</p>
            <p class="text-danger my-1">2) Подписки Вашего профиля YouTube должны быть открыты</p>
            <p class="text-danger my-1">3) Ваш профиль должен иметь хотя-бы одну подписку</p>
         </span>
         <div class="d-flex flex-row justify-content-between">
            <h3>Ваши папки:</h3>
            <button @click="createFolder" class="btn btn-secondary">+ Добавить папку</button>
         </div>
         <div class="d-flex flex-row my-2 align-self-start flex-wrap gap-2">
            <div v-if="loadingTextF != '' && store.state.folders.length == 0" class="h3 text-center"> {{ loadingTextF }} </div>
            <h3 v-else-if="store.state.folders.length == 0" class="w-100 text-center text-muted my-5"> 
               Вы не создали ни одной папки
            </h3>
            <folder-item v-else v-for="folder in store.state.folders" :id="folder.id" :name="folder.name" :color="folder.color"
               :icon="folder.icon" :channelsCount="folder.channelsCount" :editable="true" style="max-width: 180px;" />
         </div>
         <hr>
      </div>
      <h3 class="mb-3">Папки в открытом доступе:</h3>
      <div class="d-flex flex-row my-2 align-self-start flex-wrap gap-2">
         <div v-if="loadingTextPF != '' && !store.state.publicFolders.length" class="h3 text-center"> {{ loadingTextPF }} </div>
         <folder-item v-if="store.state.publicFolders.length" v-for="folder in store.state.publicFolders" :id="folder.id"
            :name="folder.name" :color="folder.color" :icon="folder.icon" :channelsCount="folder.channelsCount"
            :editable="false" style="max-width: 180px;" />
      </div>
   </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import FolderItem from "../components/FolderItem.vue";
import { useRoute } from 'vue-router';
import router from '../router'
import store from '../store'
import { sleep } from '../main'
const warning = ref('')
const loadingTextF = ref('')
const loadingTextPF = ref('')
loadingTextPF.value = "Загрузка..."
const route = useRoute()
if (route.query.f != undefined){
   let routeName = route.query.e ? "editFolder" : "folder";
   router.push({
    name: routeName,
    params: { "folder": route.query.f }
 })
}


onMounted(() => {
   if (!store.state.publicFolders.length) {
      loadingTextF.value = "Загрузка..."
      let userId = ""
      if (store.state.user.id) {
         userId = store.state.user.id
      }
      store.dispatch("setPublicFolders", userId)
   }
   const unsubscribeSetChannels = store.subscribe(async (mutations, state) => {
      if (mutations.type == 'setChannels') {
         loadingTextF.value = ""
         await sleep(100);
         if (store.state.channels.length == 0) {
            warning.value = "Внимание!"
         }
         else{
            warning.value = ""
            unsubscribeSetChannels()
         }
      }
   })
   const unsubscribeSetPublicFolders = store.subscribe(async (mutations, state) => {
      if (mutations.type == 'setPublicFolders') {
         loadingTextPF.value = ""
         unsubscribeSetPublicFolders()
      }
   })
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