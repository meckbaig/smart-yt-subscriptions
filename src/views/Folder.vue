<template>
    <div class="m-0 p-0 m-sm-2 p-sm-2">
        <!-- <router-link class="top-0 end-0 position-absolute mt-4 m-2 p-1 btn btn-info"
            :to="route.params.folder + '/edit'">Редактировать</router-link>
        <a class="top-0 start-0 position-absolute mt-4 m-2 p-1 btn btn-info" @click="printConsts">Печать констант</a> -->
        <div v-if="folder.color"
            class="d-flex flex-row align-items-center rounded rounded-2 bg-opacity-50 gap-3 mt-2 mb-3 px-3"
            v-bind:style="'background: ' + folder.color">
            <img v-if="folder.icon != ''" v-bind:src="folder.icon" class="rounded rounded-3 align-self-center my-3"
                style="max-height:50px;max-width:160px">
            <h2 v-bind:style="contrastColor(folder.color)" class="mt-1">{{ folder.name }}</h2>
            <h5 v-if="lastCall > 0" v-bind:style="contrastColor(folder.color) + 'cursor: pointer;'"
                class="ms-auto mt-1 text-end d-none d-md-flex" v-bind:title="lastCallString" @click="refreshFolderVideos()">
                Последнее обновление: {{ dateParser.formatToRelative(lastCallString) }}</h5>
        </div>
        <div v-if="videos.length > 0"
            class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6">
            <Video v-for="video in visibleVideos" :id="video.id" :title="video.title" :simpleLength="video.simpleLength"
                :viewCount="video.viewCount" :publishedAt="video.publishedAt" :channelId="video.channelId"
                :channelTitle="video.channelTitle" :channelThumbnail="video.channelThumbnail"
                :maxThumbnail="video.maxThumbnail" :isNew="video.isNew"></Video>
        </div>
        <div v-else v-bind:class="'h3 text-center ' + loadingColor" id="loadingTextDiv">
            {{ loadingText }}
        </div>
    </div>
</template>

<script setup>
import { sleep, contrastColor } from "../main";
import store from '../store'
import * as connections from "../connections";
import * as dateParser from "../dateParser";
import Video from '../components/Video.vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { computed, onMounted, ref } from 'vue'

let preventLoading = false;
let page = 0;
const videosOnPage = computed(() => store.state.videosOnPage);
const lastCallString = computed(() => {
    return new Date(lastCall.value).toLocaleTimeString()
        + " " + new Date(lastCall.value).toLocaleDateString()
})
const visibleVideos = ref([])
const videos = ref([])
const folder = ref([])
const route = useRoute();
const loadingText = ref([])
loadingText.value = "Загрузка..."
const loadingColor = ref([])
const lastCall = ref([])

onMounted(async () => {
    document.title = loadingText.value + " - Smart YT Subscriptions";
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);
    
    getFolderVideos();
    // let localStorageFolderData = JSON.parse(localStorage.getItem(route.params.folder));
    // //1000ms*60s*30m=1_800_000ms
    // if (localStorageFolderData && (Date.now() - localStorageFolderData.lastCall) < 1_800_000) {
    //     lastCall.value = localStorageFolderData.lastCall;
    //     folder.value = localStorageFolderData.folder;
    //     videos.value = localStorageFolderData.vides;
    //     checkPosition();
    // } else {
    //     getFolderVideos();
    // }
})

onBeforeRouteLeave(async () => {
      document.title = "Smart YT Subscriptions";
})

async function getFolderVideos() {
    if (Date.now() - lastCall.value > 20000) {
        videos.value = [];

        let response = await store.dispatch('getFolder', { folderId: route.params.folder });
        folder.value = response.folder;
        videos.value = response.videos;
        checkPosition();
        document.title = folder.value.name + " - Smart YT Subscriptions";

        lastCall.value = Date.now();
        localStorage.setItem(route.params.folder, JSON.stringify({ "folder": folder.value, "videos": videos.value, "lastCall": lastCall.value }));
    }
}

async function refreshFolderVideos() {
    await getFolderVideos();
    location.reload();
}

function printConsts() {
    console.log("visibleVideos: ");
    console.log(visibleVideos.value);
    console.log("videos: ");
    console.log(videos.value);
}

async function checkPosition() {
    const height = document.body.offsetHeight
    const screenHeight = window.innerHeight
    const scrolled = window.scrollY
    const threshold = height - screenHeight / 4
    const position = scrolled + screenHeight

    if (!preventLoading && position >= threshold) {
        if (videos.value.length > videosOnPage.value * page) {
            let skip = videosOnPage.value * page;
            let take = skip + videosOnPage.value;
            if (take >= videos.value.length) {
                take = videos.value.length;
            }
            visibleVideos.value = visibleVideos.value.concat(
                videos.value.slice(skip, take))
            page++;
            await sleep(50);
            checkPosition();
        }
    }
}


</script>