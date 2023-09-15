<template>
    <div class="d-flex align-items-center m-2 p-2">
        <a :href="url" target="_blank" class="pe-4 p-0 m-0">
			<img :src="thumbnailUrl" loading="lazy" draggable="false" 
            width="32" height="32" class="rounded-circle" >
        </a>
        <a class="h4 text-decoration-none crop-text-1 text-reset p-0 m-0" 
            target="_blank" :href="url">{{title}}</a>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    id: String,
    thumbnailUrl: String,
    title: String
})

const url = computed(() => {
  return 'https://www.youtube.com/channel/' + props.id
})

</script>