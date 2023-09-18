import { createRouter, createWebHistory } from "vue-router";
import Layout from '../components/Layout.vue'
import Home from '../views/Home.vue'
import EditFolder from '../views/EditFolder.vue'
import Folder from '../views/Folder.vue'
import Settings from '../views/Settings.vue'

const basePath = process.env.NODE_ENV === 'production' ? '/' : '/'
const routes = [
    {
        path: basePath,
        component: Layout,
        children: [
            {
                path: basePath,
                name: "home",
                component: Home,
            },
            {
                path: `${basePath}folder/:folder`,
                name: "folder",
                component: Folder,
            },
            {
                path: `${basePath}folder/:folder/edit`,
                name: "editFolder",
                component: EditFolder,
            },
            {
                path: `${basePath}settings`,
                name: "settings",
                component: Settings,
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;