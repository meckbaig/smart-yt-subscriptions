import { createRouter, createWebHistory } from "vue-router";
import Layout from '../components/Layout.vue'
import Home from '../views/Home.vue'
import EditFolder from '../views/EditFolder.vue'
import Folder from '../views/Folder.vue'

const routes = [
    {
        path: process.env.NODE_ENV === 'production'
        ? '/smart-yt-subscriptions/'
        : '/',
        component: Layout,
        children: [
            {
                path: "/",
                name: "home",
                component: Home,
            },
            {
                path: "/folder/:folder",
                name: "folder",
                component: Folder,
            },
            {
                path: "/folder/:folder/edit",
                name: "editFolder",
                component: EditFolder,
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;