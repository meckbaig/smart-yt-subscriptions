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
            <li v-if="newYearChecker">
                <div class="d-flex justify-content-center align-items-center form-check form-switch gap-0 fs-6 p-0 m-0">
                    <label class="form-check-label p-0 m-0">Снег:</label>
                    <input v-model="isSnowEnabled" class="form-check-input p-0 m-0 mx-2 mt-1" type="checkbox" role="switch"
                        id="snowCheck" v-on:change="toggleSnow">
                </div>
            </li>
            <li v-if="meckbaigBirthdayChecker">
                <div class="d-flex justify-content-center align-items-center form-check form-switch gap-0 fs-6 p-0 m-0">
                    <label class="form-check-label p-0 m-0">Конфетти:</label>
                    <input v-model="isMeckbaigBirthdayEnabled" class="form-check-input p-0 m-0 mx-2 mt-1" type="checkbox" role="switch"
                        id="meckbaigBirthdayCheck" v-on:change="toggleMeckbaigBirthday">
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
import { changeTheme, isLightTheme, reverseTheme, newYearChecker, meckbaigBirthdayChecker } from "../main";

const curUser = computed(() => store.state.user)
const channels = computed(() => store.state.user.subChannels);

const isSnowEnabled = computed({
    get: () => store.state.snowEnabled === undefined ? true : store.state.snowEnabled,
    set: (value) => store.commit('setSnowEnabled', value)
})

const isMeckbaigBirthdayEnabled = computed({
    get: () => store.state.meckbaigBirthdayEnabled === undefined ? true : store.state.meckbaigBirthdayEnabled,
    set: (value) => store.commit('setMeckbaigBirthdayEnabled', value)
})

async function getSubscriptions() {
    store.dispatch('updateSubChannels');
}

onMounted(async () => {
    loadTheme();
    loadSnow();
    loadBirthDay();
    document.documentElement.setAttribute("data-bs-theme", store.state.theme);
    await loadUser();
})

async function loadUser() {
    let user = localStorage.getItem('user')
    if (user != null) {
        store.commit('setUser', JSON.parse(user))
    }
}

function loadTheme() {
    let theme = cookies.get('theme')
    if (theme != undefined) {
        store.commit('setTheme', theme);
    }
}

function loadSnow() {
    let snowEnabled = cookies.get('snowEnabled')
    if (snowEnabled !== null) {
        store.commit('setSnowEnabled', snowEnabled === 'true')
    }
}

function loadBirthDay() {
    let meckbaigBirthdayEnabled = cookies.get('meckbaigBirthdayEnabled')
    if (meckbaigBirthdayEnabled !== null) {
        store.commit('setMeckbaigBirthdayEnabled', meckbaigBirthdayEnabled === 'true')
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

    if (store.state.user.subChannels.length === 0) {
        await getSubscriptions();
    }
    store.dispatch("getFolders", store.state.user.id);
}

function toggleSnow() {
    store.commit('setSnowEnabled', isSnowEnabled.value);
    cookies.set('snowEnabled', isSnowEnabled.value, Infinity)
}

function toggleMeckbaigBirthday() {
    store.commit('setMeckbaigBirthdayEnabled', isMeckbaigBirthdayEnabled.value);
    cookies.set('meckbaigBirthdayEnabled', isMeckbaigBirthdayEnabled.value, Infinity)
}
</script>