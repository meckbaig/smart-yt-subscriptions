<template>
    <div v-bind:class="style" style="max-width: 500px;"
        class="alert position-absolute end-0 bottom-0 me-3 p-1" role="alert">
        <div class="position-relative p-1">
            <button type="button" class="btn-close position-absolute end-0 top-0 m-2" @click="close"></button>
            <div v-bind:class="'p-1 text-truncate text-wrap '+ title ? 'me-5' : ''">
                <p v-if="title" class="m-1 me-5"><b class=" ">{{ title }}</b></p>
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import store from '../store'
const props = defineProps({
    title: String,
    message: String,
    style: String
})

function close(){
    let message = { title: props.title, message: props.message, style: props.style }
    store.commit("removeMessage", message)
}
</script>