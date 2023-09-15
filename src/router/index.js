import { createRouter, createWebHistory } from "vue-router";
import Layout from '../components/Layout.vue'
import Home from '../views/Home.vue'
import EditFolder from '../views/EditFolder.vue'
import Folder from '../views/Folder.vue'

const basePath = '/smart-yt-subscriptions/'
console.log("basePath: "+basePath);
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
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;