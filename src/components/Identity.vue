<template>
    <div v-if="curUser.name" class="dropdown me-2">
        <button
            v-bind:class="'btn btn-outline-' + reverseTheme + ' d-flex align-items-center dropdown-toggle text-truncate  ms-2'"
            type="button" data-bs-toggle="dropdown" aria-expanded="false" aria-haspopup="true">
            <img v-bind:src="curUser.picture" width="32" height="32" class="rounded-circle me-2">
            {{ curUser.name }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end w-100 fs-5" aria-labelledby="profile-dropdown"
            style="min-width: 200px;">
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
import * as googleAuth from '../googleAuth2'
import cookies from 'vue-cookies'
import axios from 'axios'
import store from '../store'
import { googleTokenLogin } from 'vue3-google-login'
import { computed, onMounted } from 'vue'
import { changeTheme, isLightTheme, reverseTheme, sleep } from "../main";

const curUser = computed(() => store.state.user)
const channels = computed(() => store.state.user.subChannels); // Relocated from state.channels to state.user.subChannels

async function getSubscriptions() {
    store.dispatch('updateSubChannels');
}

async function execute(idValue, nextPageToken, totalResults) {
    if (nextPageToken == undefined) {
        store.commit('setUserChannels', []); // Updated to setUserChannels to reflect the relocation
    }
    googleAuth.executeNext(idValue, nextPageToken).then(async (data) => {
        if (data == undefined) {
            let message = {
                message: "Не выполнены условия. Проверьте ссылку на свой профиль и доступ к подпискам",
                style: "alert-danger"
            }
            store.commit("addMessage", message)
        }
        else {
            let jsonData = data;
            await checkChannelsForTitles(jsonData)

            if (channels.value.length == 0) {
                store.commit('setUserChannels', cutSubChannels(jsonData.items)); // Updated to setUserChannels to reflect the relocation
                totalResults = jsonData.pageInfo.totalResults;
            }
            else {
                store.commit('concatUserChannels', cutSubChannels(jsonData.items)); // Updated to concatUserChannels to reflect the relocation
            }
            nextPageToken = jsonData.nextPageToken;
            if ((totalResults - channels.value.length > 0 && totalResults > 50) && nextPageToken != undefined) {
                await execute(idValue, nextPageToken, totalResults)
            }
            else {
                store.dispatch('updateSubChannels', store.state.user.subChannels) // Updated to reflect the relocation
            }
        }
    })
}

async function checkChannelsForTitles(channels) {
    let idsWithoutTitle = [];
    channels.items.forEach(item => {
        if (item.snippet.title == undefined) {
            idsWithoutTitle.push(item.snippet.resourceId.channelId);
        }
    });
    if (idsWithoutTitle.length != 0) {
        let channelsWithTitles = await googleAuth.getTitles(idsWithoutTitle)
        let titleMap = {};
        channelsWithTitles.items.forEach(item => {
            titleMap[item.id] = item.snippet.title;
        });
        channels.items.forEach(channel => {
            if (titleMap.hasOwnProperty(channel.snippet.resourceId.channelId)) {
                channel.snippet.title = titleMap[channel.snippet.resourceId.channelId];
            }
        });
    }
    return channels;

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

onMounted(async () => {
    let theme = cookies.get('theme')
    if (theme != undefined) {
        store.commit('setTheme', theme);
    }
    document.documentElement.setAttribute("data-bs-theme", store.state.theme);
    await loadUser();
})

async function loadUser() {
    let user = localStorage.getItem('user')
    if (user != null) {
        store.commit('setUser', JSON.parse(user))
        //1000×60×60×24=86_400_000
        if (Date.now() - localStorage.getItem("lastLogin") > 86_400_000) {
            localStorage.clear()
            localStorage.setItem("lastLogin", Date.now())
        }
    }
}

const login = () => {
    googleTokenLogin().then(async (response) => {
        await authCallback(response.access_token)
    })
}

const logout = () => {
    store.dispatch('logout');
}

const authCallback = async (access_token) => {
    await store.dispatch('authorizeUser', access_token);

    localStorage.setItem('user', JSON.stringify(store.state.user));
    localStorage.setItem("lastLogin", Date.now().toString());

    if (store.state.user.subChannels.length === 0) {
        await getSubscriptions();
    }
    store.dispatch("getFolders", store.state.user.id);
}
</script>