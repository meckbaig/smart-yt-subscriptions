import { computed, createApp, watchEffect } from 'vue'
import router from './router'
import store from './store'
import './style.css'
import App from './App.vue'
import "../lib/bootstrap/css/bootstrap.min.css"
import "bootstrap"
import vue3GoogleLogin from 'vue3-google-login'
import cookies from 'vue-cookies'


const app = createApp(App);
app.use(vue3GoogleLogin, {
    clientId: '682111284050-su5nujiir17d5g8hg7l720snlbd3bmr8.apps.googleusercontent.com'
})
    .use(router)
    .use(store)
    .mount("#app");

export function contrastColor(color) {
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);
    if (r > 150 || g > 150 || b > 150) {
        return "color:#000000;"
    }
    return "color:#ffffff;"
}

export function hoverColor(color) {
    let diff = 35;
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);
    if (r > 150 || g > 150 || b > 150) {
        return "#"+(Math.abs(r-diff)).toString(16)
            +(Math.abs(g-diff)).toString(16)
            +(Math.abs(b-diff)).toString(16)
    }
    return "#"+(r+diff).toString(16)+(g+diff).toString(16)+(b+diff).toString(16)
}

export function changeTheme() {
    let theme = reverseTheme.value;
    store.commit('setTheme', theme);
    cookies.set('theme', theme, Infinity)
    document.documentElement.setAttribute("data-bs-theme", theme);
}

export const isLightTheme = computed(() => {
    if (store.state.theme == "light") {
        return true;
    }
})

export const reverseTheme = computed(() => {
    if (isLightTheme.value) {
        return "dark";
    }
    return "light";
})

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const newYearChecker = computed(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth === 12 || currentMonth === 1;
});

export const meckbaigBirhdayChecker = computed(() => {
    const currentDate = new Date();
    return (currentDate.getMonth() + 1) === 3 && currentDate.getDate() === 2;
});

export function updateFavicon() {
    const tryUpdate = () => {
        const favicon = document.querySelector('link[rel="icon"]');
        const currentImg = document.getElementById('mainIcon');
        if (favicon && currentImg) {
            favicon.href = currentImg.src;
            return true;
        }
        return false;
    };

    // Try immediately first
    if (!tryUpdate()) {
        // If failed, retry every 100ms until successful
        const interval = setInterval(() => {
            if (tryUpdate()) {
                clearInterval(interval);
            }
        }, 100);
        
        // Clear interval after 5 seconds to prevent infinite attempts
        setTimeout(() => clearInterval(interval), 500);
    }
}

watchEffect(() => {
    if (newYearChecker.value !== undefined) {
        updateFavicon();
    }
});