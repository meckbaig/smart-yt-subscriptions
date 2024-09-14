export default {
    user: {},
    folders: [],
    publicFolders: [],
    lastUpdated: [],
    connectionStates: [],
    messages: [],
    accessLevels: [
        { name: "Private", id: 2, title: "Приватная" },
        { name: "LinkAccess", id: 3, title: "Доступ по ссылке" },
        { name: "Public", id: 4, title: "Открытая" }],
    ytThumbnails: [
        { name: "default", url: "default.jpg", width: 120 },
        { name: "medium", url: "mqdefault.jpg", width: 320 },
        { name: "high", url: "hqdefault.jpg", width: 480 },
        { name: "standard", url: "sddefault.jpg", width: 640 },
        { name: "maxres", url: "hq720.jpg", width: 1280 }
    ],
    youtubeFolderTypes: [
        { name: "videos", title: "Видео" },
        { name: "streams", title: "Трансляции" },
        { name: "shorts", title: "Shorts" }
    ],
    theme: 'light',
    folderImageSize: [ 50, 160 ],
    videosOnPage: 20, 
    debug: false
}