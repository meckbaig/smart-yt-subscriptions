<template>
    <div v-if="curUser.name" class="dropdown me-2">
        <button
            v-bind:class="'btn btn-outline-' + reverseTheme + ' d-flex align-items-center dropdown-toggle text-truncate  ms-2'"
            type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true">
            <img v-bind:src="curUser.picture" width="32" height="32" class="rounded-circle me-2">
            {{ curUser.name }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end w-100 fs-5" aria-labelledby="profile-dropdown" style="min-width: 200px;">
            <li>
                <a v-bind:href="'https://www.youtube.com/channel/' + curUser.youtubeId" target="_blank"
                    class="dropdown-item text-center">
                    Мой канал
                </a>
            </li>
            <li>
                <button @click="getSubscriptions" class="dropdown-item text-center text-wrap lh-1">
                    Обновить список каналов
                </button>
            </li>
            <li>
                <router-link :to="{ name: 'settings' }" class="dropdown-item text-center">
                    Настройки
                </router-link>
            </li>
            <li>
                <button @click="logout" class="dropdown-item text-center">
                    Выйти
                </button>
            </li>
            <li>
                <div class="d-flex justify-content-around align-items-center form-check form-switch gap-0 fs-6 p-0 m-0">
                    <label class="form-check-label p-0 m-0">Тема: тёмная</label>
                    <input v-model="isLightTheme" class="form-check-input p-0 m-0 mt-1" type="checkbox" role="switch"
                        id="themeCheck" v-on:change="changeTheme">
                    <label class="form-check-label p-0 m-0">светлая</label>
                </div>
            </li>
        </ul>
    </div>
    <button v-else @click="login" v-bind:class="'mx-2 btn btn-outline-' + reverseTheme">
        Войти
    </button>
</template>

<script setup>
import * as connections from "../connections";
import * as googleAuth from '../googleAuth'
import cookies from 'vue-cookies'
import axios from 'axios'
import store from '../store'
import { googleTokenLogin } from 'vue3-google-login'
import { computed, onMounted, ref } from 'vue'
import { changeTheme, isLightTheme, reverseTheme, sleep } from "../main";

const curUser = computed(() => store.state.user)
const channels = computed(() => store.state.channels);

async function getSubscriptions() {
    let message = {
        message: "Начато обновление списка каналов",
        style: "alert-success"
    }
    store.commit("addMessage", message)
    await loadGapi()
    googleAuth.loadClient().then(() =>
        execute(store.state.user.youtubeId))
}

function execute(idValue, nextPageToken, totalResults) {
    if (nextPageToken == undefined) {
        store.commit('setChannels', "");
    }
    googleAuth.executeNext(idValue, nextPageToken).then((data) => {
        if (data == undefined) {
            let message = {
                message: "Не выполнены условия. Проверьте ссылку на свой профиль и доступ к подпискам",
                style: "alert-danger"
            }
            store.commit("addMessage", message)
        }
        else {
            let jsonData = JSON.parse(data.body);
            if (channels.value.length == 0) {
                store.commit('setChannels', cutSubChannels(jsonData.items));
                totalResults = jsonData.pageInfo.totalResults;
            }
            else {
                store.commit('concatChannels', cutSubChannels(jsonData.items));
            }
            nextPageToken = jsonData.nextPageToken;
            if ((totalResults - channels.value.length > 0 && totalResults > 50) && nextPageToken != undefined) {
                execute(idValue, nextPageToken, totalResults)
            }
            else {
                store.dispatch('updateSubChannels', { "id": store.state.user.id, "responseData": store.state.channels })
            }
        }
    })
}

function cutSubChannels(items) {
    let result = [];
    items.forEach(item => {
        let newItem = {
            channelId: item.snippet.resourceId.channelId,
            title: item.snippet.title,
            thumbnailUrl: item.snippet.thumbnails.default.url
        }
        result.push(newItem)
    });
    return result;
}

async function loadGapi() {
    let promise = new Promise((resolve, reject) => googleAuth.loadGapi());
    promise.catch(function (error) {
        console.log('loadGapi error');
    });
    await sleep(1000)
    return await sleep(1000)
}

onMounted(async () => {
    let theme = cookies.get('theme')
    if (theme != undefined) {
        store.commit('setTheme', theme);
    }
    document.documentElement.setAttribute("data-bs-theme", store.state.theme);
    await loadUser()
    return new Promise((reject) => {
        //store.dispatch('getConnectionState').then(() => {
            if (curUser.value.name) {
                store.dispatch('getUserData', { "email": curUser.value.email, "youtubeId": curUser.value.youtubeId })
            }
        //})
    }).catch((error) => {
             reject(error)
        })
})

async function loadUser() {
    let user_session = cookies.get('user_session')
    if (user_session != null) {
        store.commit('setUser', user_session)
        //1000×60×60×24=86_400_000
        if (Date.now() - localStorage.getItem("lastLogin") > 86_400_000) {
            localStorage.clear()
            localStorage.setItem("lastLogin", Date.now())
        }
    }
}

const login = () => {
    googleTokenLogin().then((response) => {
        callback(response)
    })
}

const logout = () => {
    cookies.remove('user_session')
    store.commit('setUser')
    store.commit('setChannels')
    store.commit('setFolders')
    store.commit('setLastUpdated')
    localStorage.clear()
}

const callback = (response) => {
    axios.request({
        headers: {
            Authorization: `Bearer ${response.access_token}`
        },
        method: "GET",
        url: `https://www.googleapis.com/oauth2/v3/userinfo`
    }).then(async response => {
        let responseData = response.data;
        store.dispatch('getUserData', { "email": responseData.email, "youtubeId": "" })
            .then(async () => {
                const unsubscribeUserId = store.subscribe(async (mutations, state) => {
                    if (mutations.type == 'setUserId') {
                        await sleep(100);
                        authorizate(responseData)
                        unsubscribeUserId()
                    }
                })
            })
    });
}

async function authorizate(responseData) {
    responseData['id'] = store.state.user.id
    if (store.state.user.youtubeId != "") {
        responseData['youtubeId'] = store.state.user.youtubeId
        cookies.set("user_session", responseData, Infinity)
        await loadUser()
    }
    else {
        connections.axiosGoogle.get(
            `search?part=snippet&q=${responseData.name}&type=channel&key=AIzaSyACfvSjO1vX30rZarzIzK3ajC_BCja7JYg`)
            .then(async ({ data }) => {
                store.dispatch('updateYoutubeId', { "id": responseData.id, "youtubeId": data.items[0].id.channelId })
                logout();
                responseData['youtubeId'] = data.items[0].id.channelId
                cookies.set("user_session", responseData, Infinity)
                await loadUser()
                store.dispatch('getUserData', { "email": curUser.value.email, "youtubeId": curUser.value.youtubeId })
                    .then(() => {
                        store.state.publicFolders = [];
                        store.dispatch("setPublicFolders", store.state.user.id)
                        const unsubscribe = store.subscribe(async (mutations, state) => {
                            if (mutations.type == 'setChannels') {
                                await sleep(100);
                                if (store.state.channels.length == 0) {
                                    getSubscriptions();
                                }
                                unsubscribe()
                            }
                        })
                    })
            });
    }
}

</script>