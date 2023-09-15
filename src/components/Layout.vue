<template>
    <header>
        <nav class="navbar navbar-expand-md border-bottom box-shadow mb-3 fixed-top bg-body flex-nowrap" id="header">
            <div class="flex-row d-flex ms-3">
                <router-link :to="{ name: 'home' }" class="navbar-brand text-truncate">SmartYtSubscriptions</router-link>
                <!-- <button @click="getSubs"></button>  -->
                <!-- <button @click="loginAsp" class="btn btn-outline-success">Залогиниться</button>
                <button @click="getSubsAsp" class="btn btn-outline-info">Получить подписки</button> -->
            </div>
            <Identity class="ms-auto" />
        </nav>
    </header>
    <div class="container-fluid position-relative" v-bind:style="'min-height:'+mainHeight+'px'">
        <main id="main" role="main" class="pb-3" style="margin-top: 68px;">
            <router-view />
        </main>
    </div>

    <footer class="border-top footer text-muted" id="footer">
        <div class="container my-1">
            &copy; 2023 <a @click="printall">-</a> SmartYtSubscriptions
            <button v-bind:class="'btn px-1 pt-0 ms-1 mb-1 border-0 ' + backendColor" style="font-size: 12px; 
                padding-bottom: 1px;" disabled>Server</button>
            <button v-bind:class="'btn px-1 pt-0 ms-1 mb-1 border-0 ' + databaseColor" style="font-size: 12px;
                padding-bottom: 1px;" disabled>Database</button>
        </div>
    </footer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Identity from './Identity.vue';
import store from '../store'

onMounted(() => {
    updateMainHeight()
})

function printall() {
    Object.keys(store.state).forEach(key => {
        console.log(key, store.state[key]);
    });
}

const connectionStates = computed(() => store.state.connectionStates);
const mainHeight = ref('')
window.addEventListener('resize', updateMainHeight);

const backendColor = computed(() => {
    if (connectionStates.value.backend) { return 'btn-success' }
    else { return 'btn-danger' }
})
const databaseColor = computed(() => {
    if (connectionStates.value.database) { return 'btn-success' }
    else { return 'btn-danger' }
})

function updateMainHeight() {
    let df = window.innerHeight
     - document.getElementById("header").clientHeight
     - document.getElementById('footer').clientHeight
     - 11
    mainHeight.value = df
}

// function getSubs(){
//     getChannelId();
//     axios.create({
//         baseURL: "https://www.googleapis.com/youtube/v3/",
//     }).get(`subscriptions?mine=true&key=AIzaSyACfvSjO1vX30rZarzIzK3ajC_BCja7JYg`)
//     .then(({ data }) => {
//         console.log(data)
//     })
// }

</script>