<template>
    <div class="d-flex flex-column justify-content-center">
        <div class="form-floating mt-2 mx-auto" style="min-width: 250px;">
            <input v-model="ytId" id="ytId" class="form-control" />
            <label for="ytId" class="form-label">Ваш идентификатор youtube</label>
        </div>
        <button @click="saveChanges" class="btn btn-success mt-2 mx-auto">Сохранить</button>
    </div>
</template>


<script setup>
import router from '../router'
import store from '../store'
import { onMounted, ref } from 'vue'

const ytId = ref('')

onMounted(() => {
    ytId.value = store.state.user.youtubeId;
    if (ytId.value === undefined) {
        router.push({ name: "home" })
    }
})

function saveChanges(){
    store.dispatch('updateYoutubeId', { id: store.state.user.id, youtubeId: ytId.value})
}

</script>