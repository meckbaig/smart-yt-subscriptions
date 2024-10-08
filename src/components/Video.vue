<template>
    <div v-bind:id="id" class="col align-content-top rounded mb-2">
        <div class="position-relative">
            <a :href="url" target="_blank">
                <img class="rounded-3 w-100" style="aspect-ratio: 16/9; object-fit: cover" :src="thumbnailDpi" loading="lazy">
                <p class="badge position-absolute bottom-0 end-0 text-wrap" style="margin:4px; padding: 4px; padding-top: 2px; background-color: rgba(0, 0, 0, 0.8);">
                    {{ simpleLength }}</p>
                <p v-if="isNew" class="badge position-absolute bottom-0 start-0 text-wrap" style="margin:4px; padding: 4px; padding-top: 2px; background-color: rgba(0, 255, 0, 0.8);">Новое</p>
            </a>
        </div>
        <div class="d-flex align-items-top mt-2">
            <a :href="channelUrl" target="_blank" class="me-2 p-0 mt-1 mb-auto">
                <img :src="channelThumbnail" loading="lazy" draggable="false" width="32" height="32" class="rounded-circle">
            </a>
            <ul class="list-unstyled mt-0">
                <li>
                    <a v-bind:class="' text-' + reverseTheme + ' text-decoration-none crop-text-2 lh-sm fw-semibold p-0 m-0'"
                        target="_blank" v-bind:title="title" :href="url">{{ title }}</a>
                </li>
                <li>
                    <a class="text-decoration-none crop-text-1 text-reset p-0 m-0 fw-normal" target="_blank"
                        :href="channelUrl">
                        {{ channelTitle }}</a>
                </li>
                <li>
                    <div class="d-flex flex-row flex-wrap align-items-center">
                        <a class="text-decoration-none text-nowrap text-reset p-0 m-0 fw-normal lh-1"
                            style="font-size: 14px;">
                            {{ viewCountString }}</a>
                        <p class="m-0 p-0 mx-1">•</p>
                        <a class="text-decoration-none text-nowrap text-reset p-0 m-0 fw-normal lh-1"
                            style="font-size: 14px;" v-bind:title="dateString">
                            {{ dateParser.formatToRelative(dateString) }}</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { reverseTheme } from "../main";
import { getWording } from "../wordings";
import * as dateParser from "../dateParser";
import store from '../store';
window.addEventListener('resize', updateThumbnailDpi);

const thumbnailDpi = ref('')
const thumbnails = ref([])

onMounted(() => {
    thumbnails.value = store.state.ytThumbnails.slice(0, props.maxThumbnail)
    updateThumbnailDpi()
})

function updateThumbnailDpi() {
    if (!document.getElementById(props.id)){
        window.removeEventListener('resize', updateThumbnailDpi);
        return;
    }
    let width = document.getElementById(props.id).clientWidth * window.devicePixelRatio;
    let index = 1;
    for (let i = 1; i < thumbnails.value.length; i++) {
        if (width < thumbnails.value[i].width) {
            break;
        }
        index = i;
    }
    thumbnailDpi.value = `https://i.ytimg.com/vi/${props.id}/${thumbnails.value[index].url}`
}

const props = defineProps({
    id: String,
    title: String,
    simpleLength: String,
    viewCount: String,
    publishedAt: String,
    channelId: String,
    channelTitle: String,
    channelThumbnail: String,
    maxThumbnail: Number,
    isNew: Boolean
})

const url = computed(() => {
    return 'https://www.youtube.com/watch?v=' + props.id
})

const channelUrl = computed(() => {
    return 'https://www.youtube.com/channel/' + props.channelId
})

const dateString = computed(() => {
    return new Date(props.publishedAt).toLocaleTimeString()
        + " " + new Date(props.publishedAt).toLocaleDateString()
})

const viewCountString = computed(() => {
    if (props.viewCount == "") {
        return "Прямая трансляция"
    }
    let inViewCount = props.viewCount.replace(" ", "");
    let resultString = getWording(inViewCount, wordingsViews);
    let tmpArr = resultString.split(" ");
    return `${ Number(tmpArr[0]).toLocaleString('ru-RU')} ${tmpArr[1]}`;
})

const wordingsViews = ["просмотр", "просмотра", "просмотров" ];
</script>

<style scoped>
.crop-text-1 {
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.crop-text-2 {
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}

.crop-text-3 {
    -webkit-line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
</style>