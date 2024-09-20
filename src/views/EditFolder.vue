<template>
    <div v-if="folder.guid" class="row align-self-start px-2 pt-2 pb-0 mx-2 mt-2 mb-0 gap-2">
        <span class="col px-0">
            <input v-model="search" class="form-control mb-2" placeholder="Поиск" />
            <div class="border border-1 border-secondary rounded-2"
                v-bind:style="'overflow-y: scroll; max-height: ' + channelsListHeight + 'px'">
                <draggable v-model="channels" delay="200" :delay-on-touch-only="true" :group="{
                    name: 'channels',
                }" item-key="id" style="min-height: 200px; min-width: 200px">
                    <template #item="{ element: item, index: index }">
                        <div v-if="containsSearch(item.title)" class="d-flex flex-row justify-content-between">
                            <ChannelItem :title="item.title" :id="item.channelId" :thumbnailUrl="item.thumbnailUrl" />
                            <a class="m-auto me-2 btn btn-outline-secondary p-0 border border-0"
                                @click="toFolder(index)" style="cursor: pointer;">
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
            <div class="border border-1 align-self-start border-secondary rounded-2 mb-1 w-100"
                v-bind:style="'overflow-y: scroll; max-height: ' + folderListHeight + 'px'">
                <draggable v-model="folder.subChannels" group="channels" item-key="id" :animation="300"
                    style="min-height: 200px; min-width: 200px" delay="200" :delay-on-touch-only="true">
                    <template #item="{ element: item, index: index }">
                        <div @mousemove="onChange(index)"
                            class="d-flex border border-1 border-secondary-subtle rounded-2">
                            <ChannelItem :title="item.title" :id="item.channelId" :thumbnailUrl="item.thumbnailUrl" />
                            <button class="btn btn-close ms-auto p-2" @click="removeAt(index)"></button>
                        </div>
                    </template>
                </draggable>
            </div>
            <span id="folderButtons">
                <div class="d-flex gap-2 mb-2">
                    <div v-for="folderType in store.state.youtubeFolderTypes">
                        <input type="checkbox" :id="folderType.name" :value="folderType.name"
                            :checked="folder.youtubeFolders.includes(folderType.name)"
                            @change="ytFolderCheckedChanged(folderType.name)" />
                        <label class="ms-1" :for="folderType.name">{{ folderType.title }}</label>
                    </div>
                </div>
                <div class="d-flex flex-row gap-2 mb-2">
                    <div class="d-flex gap-2 flex-wrap">
                        <div class="input-group p-0" style="min-width: 190px;">
                            <label class="input-group-text">Доступ</label>
                            <select v-model="folder.access.id" class="form-select pe-2"
                                @change="updateAccessName($event.target.value)">
                                <option v-for="level in store.state.accessLevels" :value="level.id">
                                    {{ level.title }}
                                </option>
                            </select>
                        </div>
                        <input v-model="folder.color" type="color" class="h-auto flex-fill" id="colorInput"
                            style="min-height: 38px;" />
                        <label for="uploadIcon" class="btn btn-info flex-fill" style="display: block;">
                            Добавить иконку
                            <input type="file" id="uploadIcon" accept="image/*" @change="addIcon" hidden />
                        </label>
                    </div>
                    <img v-if="folder.icon != null" class="rounded rounded-1 align-self-start" title="Удалить иконку" @click="folder.icon = null"
                        v-bind:style="'max-height: ' + iconHeight + 'px;cursor:pointer'" :src="folder.icon" />
                    <div class="d-flex flex-column ms-auto gap-2 mb-auto" id="submitButtons">
                        <button @click="saveChanges" class="btn btn-success">Сохранить</button>
                        <button @click="deleteFolder" class="btn btn-danger">Удалить</button>
                    </div>
                </div>
                <p class="mb-0 opacity-50" @click="print()" v-bind:title="getLastUpdateTitle">
                    {{ getFormattedLastUpdate }}
                </p>
                <!-- <button @click="print" class="btn" style="background-color: transparent; border: none; cursor: default; color: transparent;">
                    print
                </button> -->
            </span>
        </span>
    </div>
    <div v-else v-bind:class="'h3 text-center ' + loadingColor" id="loadingTextDiv">
        {{ loadingText }}
    </div>
</template>

<script setup>
import ChannelItem from '../components/ChannelItem.vue'
import draggable from 'vuedraggable';
import * as dateParser from "../dateParser";
import { useRoute } from 'vue-router';
import { sleep } from "../main";
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
const iconHeight = ref(84)
window.addEventListener('resize', updateIconHeight);
const loadingText = ref([])
loadingText.value = "Загрузка..."
const loadingColor = ref([])
const noAccess = ref(false)


onMounted(async () => {
    if (!store.state.user.youtubeId) {
        showNoAccessError();
        return;
    }
    try {
        let folderData = store.state.folders.find(folder => folder.guid === route.params.folder);
        if (folderData) {
            folder.value = folderData;
        } else {
            let data = await store.dispatch('getFolder', { folderId: route.params.folder, toEdit: true });
            folder.value = data.folder;
        }
        initUpdateUi() 
    } catch (error) {
        console.error('Error:', error);
        handleErrors(error);
    }
})

async function initUpdateUi() {
    await sleep(100);
    updateListsHeight();
    updateIconHeight();
}

function showNoAccessError() {
    noAccess.value = true;
    loadingText.value = "У вас нет доступа к редактированию данной папки";
    loadingColor.value = "text-danger";
}

function handleErrors(error) {
    if (error.response && error.response.status === 403) {
        showNoAccessError();
    } else if (error.response && error.response.status === 400 &&
        error.response.data.errors?.guid?.[0]?.code === "FolderDoesNotExist") {
        loadingText.value = "Указанная папка не существует";
        loadingColor.value = "text-danger";
    } else {
        loadingText.value = "Произошла ошибка при загрузке папки";
        loadingColor.value = "text-danger";
    }
}

function ytFolderCheckedChanged(ytFolderName) {
    if (folder.value.youtubeFolders.includes(ytFolderName)) {
        folder.value.youtubeFolders.splice(folder.value.youtubeFolders.indexOf(ytFolderName), 1)
    }
    else {
        if (folder.value.youtubeFolders === "") {
            folder.value.youtubeFolders = []
        }
        folder.value.youtubeFolders = folder.value.youtubeFolders.concat(ytFolderName);
    }
}

function updateIconHeight() {
    if (document.getElementById("submitButtons")) {
        iconHeight.value = document.getElementById("submitButtons").clientHeight
    }
    // else {
    //     window.removeEventListener("resize", updateIconHeight)
    // }
}

function filteredChannels() {
    if (folder.value.subChannels != undefined && folder.value.subChannels != "") {
        return store.state.user.subChannels.filter((item) =>
            folder.value.subChannels.filter(i => i.channelId == item.channelId).length == 0)
    }
    else return store.state.user.subChannels
}

function addIcon(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.onloadend = function () {
        let i = new Image();
        let canvas = document.createElement('canvas');
        i.onload = function () {
            let sizes = store.state.folderImageSize;
            if (i.width > i.height && i.width > sizes[1] * 2) {
                canvas.width = sizes[1] * 2;
                canvas.height = Math.floor(canvas.width / i.width * i.height);
            }
            else if (i.width < i.height && i.height > sizes[0] * 2) {
                canvas.height = sizes[0] * 2;
                canvas.width = Math.floor(canvas.height / i.height * i.width);
            }
            else {
                canvas.height = i.height;
                canvas.width = i.width;
            }
            let ctx = canvas.getContext('2d');
            ctx.drawImage(i, 0, 0, canvas.width, canvas.height);
            folder.value.icon = canvas.toDataURL("image/jpeg", 0.5);
        };
        i.src = reader.result;
    }
    reader.readAsDataURL(file);
}

async function saveChanges() {
    folder.value.channelsCount = folder.value.subChannels.length;
    let folderData = await store.dispatch('updateFolder', { folder: folder.value });
    if (folderData) {
        folder.value = folderData;
    }
}

function deleteFolder() {
    store.dispatch("deleteFolder", route.params.folder);
    router.push({
        name: "home"
    })
}

function print() {
    console.log(folder.value);
}

function onChange(index) {
    for (let i = 0; i < folder.value.subChannels.length; i++) {
        if (i != index && folder.value.subChannels[i].channelId == folder.value.subChannels[index].channelId) {
            folder.value.subChannels.splice(index, 1);
            index = index - 1
            break;
        }
    }
    index = index + 1
    if (folder.value.subChannels.length > index) {
        for (let i = 0; i < folder.value.subChannels.length; i++) {
            if (i != index && folder.value.subChannels[i].channelId == folder.value.subChannels[index].channelId) {
                folder.value.subChannels.splice(index, 1);
                break;
            }
        }
    }
}

function updateListsHeight() {
    if (window.innerHeight < window.innerWidth * 1.5) {
        channelsListHeight.value = window.innerHeight - document.getElementById("header").clientHeight
            - 90 - document.getElementById("footer").clientHeight;
        if (document.getElementById("folderButtons")) {
            folderListHeight.value = window.innerHeight - document.getElementById("header").clientHeight
                - 90 - document.getElementById("footer").clientHeight
                 - document.getElementById("folderButtons").clientHeight;
        }
    }
    else {
        channelsListHeight.value = window.innerHeight / 2 - document.getElementById("header").clientHeight
            - 110 - document.getElementById("footer").clientHeight;
        folderListHeight.value = window.innerHeight / 2 - document.getElementById("header").clientHeight
            + 50 - document.getElementById("footer").clientHeight
             - document.getElementById("folderButtons").clientHeight;
    }
}

function toFolder(index) {
    folder.value.subChannels = channels.value.splice(index, 1).concat(folder.value.subChannels)
}

function removeAt(index) {
    folder.value.subChannels.splice(index, 1)
}

let containsSearch = (title) => title.toLowerCase().includes(search.value.toLowerCase())

const getLastUpdateTitle = computed(() => {
    return folder.value.lastModified ? new Date(folder.value.lastModified).toLocaleString() : '';
})

const getFormattedLastUpdate = computed(() => {
    return "Последнее обновление: " + dateParser.formatToRelative(
        folder.value.lastModified ? new Date(folder.value.lastModified) : null);
})

function updateAccessName(selectedId) {
    const selectedLevel = store.state.accessLevels.find(level => level.id === parseInt(selectedId));
    if (selectedLevel) {
        folder.value.access.name = selectedLevel.name;
    }
}
</script>