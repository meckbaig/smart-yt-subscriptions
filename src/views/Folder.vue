<template>
    <div class="m-0 p-0 m-sm-2 p-sm-2">
        <div v-if="folder.color"
            class="d-flex flex-row align-items-center rounded rounded-2 bg-opacity-50 gap-3 mt-2 mb-3 px-3"
            v-bind:style="'background: ' + folder.color">
            <img v-if="folder.icon != ''" v-bind:src="folder.icon" class="rounded rounded-3 align-self-center my-3"
                style="max-height:50px;max-width:160px">
            <h2 v-bind:style="contrastColor(folder.color)" class="mt-1">{{ folder.name }}</h2>
            <h5 v-if="lastCall > 0" v-bind:style="contrastColor(folder.color)"
                class="ms-auto mt-1 text-end d-none d-md-flex" v-bind:title="lastCallString">
                Последнее обновление: {{ dateParser.formatToRelative(lastCallString) }}
            </h5>
            <button @click="refreshFolderVideos()" class="btn btn-light mx-0 py-1 ms-auto ms-md-0" v-bind:disabled="refreshButtonLocked">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor"
                    class="bi bi-arrow-clockwise m-0" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                    <path
                        d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                </svg>
            </button>
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
import * as dateParser from "../dateParser";
import Video from '../components/Video.vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router';
import { computed, onMounted, ref, watchEffect } from 'vue'

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
const refreshButtonLocked = ref(true)
const noAccess = ref(false)

onMounted(async () => {
    document.title = loadingText.value + " - Smart YT Subscriptions";
    window.addEventListener('scroll', checkPosition);
    window.addEventListener('resize', checkPosition);

    await getFolderVideos();
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
    // Set timer for refresh button
    let timeDiff = lastCall.value - Date.now();

    setTimeout(() => {
        refreshButtonLocked.value = false;
    }, timeDiff + 20000);
})

onBeforeRouteLeave(async () => {
    document.title = "Smart YT Subscriptions";
})

async function getFolderVideos() {
    videos.value = [];
    noAccess.value = false;

    try {
        let response = await store.dispatch('getFolder', { folderId: route.params.folder });
        folder.value = response.folder;
        videos.value = response.videos;
        checkPosition();
        document.title = folder.value.name + " - Smart YT Subscriptions";
        lastCall.value = new Date(folder.value.lastVideosAccess);
        localStorage.setItem(route.params.folder, JSON.stringify({ "folder": folder.value, "videos": videos.value, "lastCall": lastCall.value }));
    } catch (error) {
        if (error.response && error.response.status === 403) {
            noAccess.value = true;
            loadingText.value = "У вас нет доступа к данной папке";
            loadingColor.value = "text-danger";
        } else {
            console.error('Error fetching folder:', error);
            loadingText.value = "Произошла ошибка при загрузке папки";
            loadingColor.value = "text-danger";
        }
    }
}

async function refreshFolderVideos() {
    refreshButtonLocked.value = true;
    await getFolderVideos();
    location.reload();
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

watchEffect(async () => {
    await sleep(1000);
    setInterval(() => {
        lastCall.value = new Date(folder.value.lastVideosAccess);
    }, 5000);
})
</script>