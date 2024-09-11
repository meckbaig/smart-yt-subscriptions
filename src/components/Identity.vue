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
import cookies from 'vue-cookies'
import store from '../store'
import { googleTokenLogin } from 'vue3-google-login'
import { computed, onMounted } from 'vue'
import { changeTheme, isLightTheme, reverseTheme } from "../main";

const curUser = computed(() => store.state.user)
const channels = computed(() => store.state.user.subChannels);

async function getSubscriptions() {
    store.dispatch('updateSubChannels');
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