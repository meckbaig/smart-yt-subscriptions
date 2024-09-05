<template>
    <header>
        <nav class="navbar navbar-expand-md border-bottom box-shadow mb-3 py-0 fixed-top bg-body flex-nowrap" id="header">
            <div class="flex-row d-flex ms-3">
                <router-link :to="{ name: 'home' }" class="navbar-brand text-truncate my-0 d-flex flex-row gap-3">
                    <img type="image/png" src="/syts-icon-new.png" class="m-0" style="height: 48px;" />
                    <div class="d-flex d-sm-none align-self-center">SYTS</div>
                    <div class="d-none d-sm-flex align-self-center">SmartYtSubscriptions</div>
                </router-link>
                <!-- <button @click="getSubs"></button>  -->
                <!-- <button @click="loginAsp" class="btn btn-outline-success">Залогиниться</button>
                <button @click="getSubsAsp" class="btn btn-outline-info">Получить подписки</button> -->
            </div>
            <Identity class="ms-auto" />
        </nav>
    </header>
    <div class="container-fluid position-relative" v-bind:style="'min-height:' + mainHeight + 'px'">
        <main id="main" role="main" class="pb-3" style="margin-top: 68px;">
            <router-view />
            <Message v-for="message in store.state.messages" :message="message.message" :title="message.title"
                :style="message.style" />
        </main>
    </div>

    <footer class="border-top footer text-muted" id="footer">
        <div class="container my-1">
            &copy; 2023 <a @click="printall">-</a> SmartYtSubscriptions
            <button v-bind:class="'btn px-1 pt-0 ms-1 mb-1 border-0 ' + backendColor" style="font-size: 12px; 
                padding-bottom: 1px;" disabled>Server</button>
            <button v-bind:class="'btn px-1 pt-0 ms-1 mb-1 border-0 ' + databaseColor" style="font-size: 12px;
                padding-bottom: 1px;" disabled>Database</button>
            <a href="https://github.com/meckbaig/smart-yt-subscriptions" target="_blank" style="height: 19px;" class="ms-2 m-0 p-0">
                <svg height="19" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="19" data-view-component="true"
                    fill="currentColor" v-bind:class="'octicon octicon-mark-github mb-1 text-' + reverseTheme">
                    <path
                        d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z">
                    </path>
                </svg>
            </a>
        </div>
    </footer>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Identity from './Identity.vue';
import Message from './Message.vue';
import store from '../store'
import cookies from 'vue-cookies'
import { reverseTheme } from "../main"

onMounted(() => {
    updateMainHeight()
})

function printall() {
    Object.keys(store.state).forEach(key => {
        console.log(key, store.state[key]);
    });
    console.log("Token:", cookies.get('token'));
    console.log("Refresh Token:", cookies.get('refreshToken'));
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
        - 15
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