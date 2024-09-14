<template>
   <div class="m-0 p-0 m-sm-2 p-sm-2">
      <div v-if="store.state.user.name">
         <span v-if="warning != ''" class="mx-auto mb-3">
            <h3 @click="pMsg" class="text-danger ">Внимание!</h3>
            <p class="text-danger my-1">Требования для использования сервиса:</p>
            <p class="text-danger my-1">1) На аккаунт Google должен быть зарегистрирован профиль (канал) YouTube</p>
            <p class="text-danger my-1">2) Подписки Вашего профиля YouTube должны быть открыты (открыть подписки можно
               <a href="https://www.youtube.com/account_privacy" class="text-danger" target="_blank">здесь</a>)
            </p>
            <p class="text-danger my-1">3) Ваш профиль должен иметь хотя-бы одну подписку</p>
            <p class="text-danger mt-2">Если все вышеперечисленные требования выполнены - проверьте,
               правильно ли отображается <a v-bind:href="'https://www.youtube.com/channel/' + store.state.user.youtubeId"
                  class="text-danger" target="_blank">Ваш канал</a></p>
            <p class="text-danger my-1">Если ссылка ведёт не на Ваш канал, вы можете изменить идентификатор канала в
               настройках</p>
            <p class="text-danger my-1 mb-4">Идентификатор канала можно получить в разделе "О канале", нажав на кнопку
               "поделиться" и выбрав "Скопировать идентификатор канала"</p>
         </span>
         <div class="d-flex flex-row justify-content-between">
            <h3>Ваши папки:</h3>
            <button @click="createFolder" class="btn btn-secondary">+ Добавить папку</button>
         </div>
         <div class="d-flex flex-row my-2 align-self-start flex-wrap gap-2">
            <h3 v-if="loadingTextF == '' && folders.length == 0" class="w-100 text-center text-muted my-5">
               Вы не создали ни одной папки
            </h3>
            <div v-else-if="folders.length == 0" class="h3 text-center"> {{ loadingTextF }}
            </div>
            <folder-item 
               v-else 
               v-for="folder in folders" 
               :key="folder.guid" 
               :guid="folder.guid" 
               :name="folder.name" 
               :color="folder.color"
               :icon="folder.icon" 
               :channelsCount="folder.channelsCount" 
               :editable="true" 
               style="max-width: 180px;" 
            />
         </div>
         <hr>
      </div>
      <h3 class="mb-3">Папки в открытом доступе:</h3>
      <div class="d-flex flex-row my-2 align-self-start flex-wrap gap-2">
         <div v-if="loadingTextPF != '' && publicFolders.length == 0" class="h3 text-center"> {{ loadingTextPF }}
         </div>
         <folder-item 
            v-if="publicFolders.length" 
            v-for="folder in publicFolders" 
            :key="folder.guid" 
            :guid="folder.guid" 
            :name="folder.name"
            :color="folder.color" 
            :icon="folder.icon" 
            :channelsCount="folder.channelsCount" 
            :editable="false"
            style="max-width: 180px;" />
      </div>
   </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import FolderItem from "../components/FolderItem.vue";
import { useRoute } from 'vue-router';
import router from '../router'
import store from '../store'
import { sleep } from '../main'
const warning = ref('')
const loadingTextF = ref('')
const loadingTextPF = ref('')
loadingTextPF.value = "Загрузка..."
const folders = computed(() => store.state.folders)
const publicFolders = computed(() => store.state.publicFolders)
const route = useRoute()
if (route.query.f != undefined) {
   let routeName = route.query.e == "true" ? "editFolder" : "folder";
   router.push({
      name: routeName,
      params: { "folder": route.query.f }
   })
}
else if (route.query.s == true) {
   router.push({ name: "settings" })
}

onMounted(() => {
   if (Object.keys(route.query).length > 0) {
      return;
   }
   const unsubscribeSetChannels = store.subscribe(async (mutations, state) => {
      if (mutations.type == 'setChannels') {
         loadingTextF.value = ""
         await sleep(100);
         if (store.state.user.subChannels.length == 0) {
            warning.value = "Внимание!"
         }
         else {
            warning.value = ""
            unsubscribeSetChannels()
         }
      }
   })
   const unsubscribeSetPublicFolders = store.subscribe(async (mutations, state) => {
      if (mutations.type == 'updateFolders') {
         loadingTextF.value = ""
         loadingTextPF.value = ""
         unsubscribeSetPublicFolders()
      }
   })
   if (!store.state.publicFolders.length) {
      loadingTextF.value = "Загрузка..."
      let userId = ""
      if (store.state.user.id) {
         userId = store.state.user.id
      }
      store.dispatch("getFolders", userId)
   }
})

async function createFolder() {
   let folderName = "New folder 1";
   let existingFolders = store.state.folders.map(folder => folder.name);
   let counter = 1;
   while (existingFolders.includes(folderName)) {
      folderName = `New folder ${++counter}`;
   }
   await store.dispatch("createFolder", { "id": store.state.user.id, "name": folderName });
}
</script>