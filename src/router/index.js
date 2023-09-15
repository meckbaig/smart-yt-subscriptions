import { createRouter, createWebHistory } from "vue-router";
import Layout from '../components/Layout.vue'
import Home from '../views/Home.vue'
import EditFolder from '../views/EditFolder.vue'
import Folder from '../views/Folder.vue'

const baseBath = process.env.NODE_ENV === 'production' ? '/smart-yt-subscriptions/' : '/'
const routes = [
    {
        path: baseBath,
        component: Layout,
        children: [
            {
                path: baseBath,
                name: "home",
                component: Home,
            },
            {
                path: baseBath+"folder/:folder",
                name: "folder",
                component: Folder,
            },
            {
                path: baseBath+"folder/:folder/edit",
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