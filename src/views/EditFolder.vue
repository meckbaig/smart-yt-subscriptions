<template>
    <div v-if="folder.id" class="row align-self-start p-2 m-2 gap-2">
        <span class="col px-0">
            <input v-model="search" class="form-control mb-2" placeholder="Поиск" />
            <div class="border border-1 border-secondary rounded-2"
                v-bind:style="'overflow-y: scroll; max-height: ' + channelsListHeight + 'px'">
                <draggable v-model="channels" :group="{
                    name: 'channels'
                    // , pull: 'clone', put: false 
                }" item-key="id" style="min-height: 200px; min-width: 200px">
                    <template #item="{ element: item, index: index }">
                        <div v-if="containsSearch(item.snippet.title)" class="d-flex flex-row justify-content-between">
                            <ChannelItem :title="item.snippet.title" :id="item.snippet.resourceId.channelId"
                                :thumbnailUrl="item.snippet.thumbnails.default.url" />
                            <a class="m-auto me-2 btn btn-outline-secondary p-0 border border-0" @click="toFolder(index)"
                                style="cursor: pointer;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor"
                                    class="bi bi-arrow-right-square" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                                </svg>
                            </a>
                        </div>
                    </template>
                </draggable>
            </div>

        </span>
        <span class="px-0 col d-flex flex-column">
            <input v-model="folder.name" class="form-control mb-2" maxlength="50" />
            <div class="border border-1 align-self-start border-secondary rounded-2 mb-2 w-100"
                v-bind:style="'overflow-y: scroll; max-height: ' + folderListHeight + 'px'">
                <draggable v-model="folder.subChannelsJson" group="channels" item-key="id" :animation="300"
                    style="min-height: 200px; min-width: 200px">
                    <template #item="{ element: item, index: index }">
                        <div @mousemove="onChange(index)" class="d-flex border border-1 border-secondary-subtle rounded-2">
                            <ChannelItem :title="item.snippet.title" :id="item.snippet.resourceId.channelId"
                                :thumbnailUrl="item.snippet.thumbnails.default.url" />
                            <button class="btn btn-close ms-auto p-2" @click="removeAt(index)"></button>
                        </div>
                    </template>
                </draggable>
            </div>
            <span id="folderButtons">
                <div class="d-flex flex-row gap-2 mb-2">
                    <div class="d-flex gap-2 flex-wrap">
                        <div class="input-group p-0" style="min-width: 190px;">
                            <label class="input-group-text">Доступ</label>
                            <select v-model="folder.accessId" class="form-select pe-2">
                                <option v-for="level in store.state.accessLevels" :value="level.id">
                                    {{ level.title }}</option>
                            </select>
                        </div>
                        <input v-model="folder.color" type="color" class="h-auto flex-fill" id="colorInput"
                            style="min-height: 38px;" />
                        <label for="uploadIcon" class="btn btn-info flex-fill" style="display: block;">
                            Добавить иконку
                            <input type="file" id="uploadIcon" accept="image/*" @change="addIcon" hidden />
                        </label>
                    </div>
                        <img class="rounded rounded-1 align-self-start" title="Удалить иконку" @click="folder.icon = ''"
                            v-bind:style="'max-height: ' + iconHeight + 'px;cursor:pointer'"
                            :src="folder.icon" />
                    <div class="d-flex flex-column ms-auto gap-2 mb-auto" id="submitButtons">
                        <button @click="saveChanges" class="btn btn-success">Сохранить</button>
                        <button @click="deleteFolder" class="btn btn-danger">Удалить</button>
                    </div>
                </div>
                <!-- <button @click="print">print</button> -->
                <p class="mb-2 opacity-50">Последнее обновление: {{ folder.lastChannelsUpdate }}</p>
            </span>
        </span>
    </div>
    <div v-else v-bind:class="'h3 text-center ' + loadingColor" id="loadingTextDiv">
        {{ loadingText }}
    </div>
</template>
  
<script setup>
import { sleep } from "../main";
import ChannelItem from '../components/ChannelItem.vue'
import draggable from 'vuedraggable';
import * as connections from "../connections";
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue'
import store from '../store'
import router from '../router'

const search = ref('')
const route = useRoute();
const channels = computed(() => filteredChannels())
const folder = ref([])
const channelsListHeight = ref('')
const folderListHeight = ref('')
window.addEventListener('resize', updateListsHeight);
const iconHeight = ref('')
iconHeight.value = 1;
window.addEventListener('resize', updateIconHeight);
const loadingText = ref([])
loadingText.value = "Загрузка..."
const loadingColor = ref([])


onMounted(async () => {
    connections.axiosClient.get(`Folder/Get?id=${route.params.folder}&userId=${store.state.user.id}&edit=true`)
        .then(async ({ data }) => {
            folder.value = data;
            if (folder.value.subChannelsJson == "") {
                folder.value.subChannelsJson = []
            }
            await sleep(100)
            updateListsHeight()
            updateIconHeight()
        })
        .catch(function (error) {
            loadingText.value = error.response.data.title;
            loadingColor.value = "text-danger";
        });
    //     const unsubscribe = store.subscribe(async (mutations, state) => {
    //     if (mutations.type == 'setChannels') {
    //         await sleep(100);
    //         channels.value = state.channels.filter((item) =>
    //             folder.value.subChannelsJson.filter(i => i.id == item.id).length == 0)
    //         unsubscribe()
    //     }
    // })
})

function updateIconHeight() {
    if (document.getElementById("submitButtons")){
        iconHeight.value = document.getElementById("submitButtons").clientHeight
    }
    else{
        window.removeEventListener("resize", updateIconHeight)
    }
}

function filteredChannels() {
    if (folder.value.subChannelsJson != undefined && folder.value.subChannelsJson != "") {
        return store.state.channels.filter((item) =>
            folder.value.subChannelsJson.filter(i => i.id == item.id).length == 0)
    }
    else return store.state.channels
}

async function excludeSimilarVideos() {
    while (channels.value.length == 0) {
        channels.value = store.state.channels;
        if (channels.value.length != 0) {
            channels.value = channels.value.filter((item) => folder.value.subChannelsJson.filter(i => i.id == item.id).length == 0);
        }
        else { await sleep(100); }
    }
}

function addIcon(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        folder.value.icon = reader.result
    }
    reader.readAsDataURL(file);
}

function saveChanges() {
    folder.value.channelsCount = folder.value.subChannelsJson.length;
    connections.axiosClient.post(`Folder/Update`, folder.value)
        .then((response) => {
            folder.value.lastChannelsUpdate = response.data.lastChannelsUpdate;
            console.log(response);
            store.commit('setFolder', response.data)
        })
}

function deleteFolder() {
    store.dispatch("deleteFolder", { "id": route.params.folder, "userId": store.state.user.id });
    router.push({
        name: "home"
    })
}

function print() {
    folder.value.channelsCount = folder.value.subChannelsJson.length;
    console.log(JSON.stringify(folder.value));
}

function onChange(index) {
    for (let i = 0; i < folder.value.subChannelsJson.length; i++) {
        if (i != index && folder.value.subChannelsJson[i].id == folder.value.subChannelsJson[index].id) {
            folder.value.subChannelsJson.splice(index, 1);
            index = index - 1
            break;
        }
    }
    index = index + 1
    if (folder.value.subChannelsJson.length > index) {
        for (let i = 0; i < folder.value.subChannelsJson.length; i++) {
            if (i != index && folder.value.subChannelsJson[i].id == folder.value.subChannelsJson[index].id) {
                folder.value.subChannelsJson.splice(index, 1);
                break;
            }
        }
    }
}

function updateListsHeight() {
    channelsListHeight.value = window.innerHeight - document.getElementById("header").clientHeight - 70
    if (document.getElementById("folderButtons")) {
        folderListHeight.value = window.innerHeight - document.getElementById("header").clientHeight
            - 70 - document.getElementById("folderButtons").clientHeight
    }
}

function toFolder(index) {
    folder.value.subChannelsJson = channels.value.splice(index, 1).concat(folder.value.subChannelsJson)
    //this.folder.subChannelsJson = this.folder.subChannelsJson.append(this.channels[index]);
    // if (this.folder.subChannelsJson[this.folder.subChannelsJson.length-1] == ""){
    //     this.folder.subChannelsJson.pop();
    // }    
}

function removeAt(index) {
    //this.channels = this.folder.subChannelsJson.splice(index, 1).concat(this.channels)
    folder.value.subChannelsJson.splice(index, 1)
}

let containsSearch = (title) => title.toLowerCase().includes(search.value.toLowerCase())

</script>