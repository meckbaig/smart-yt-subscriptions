import * as connections from "../connections";
import cookies from 'vue-cookies'

export function getConnectionState({ commit }) {
    connections.axiosClient.get(`Auth/GetConnectionState`)
        .then(({ data }) => {
            commit('setConnectionStates', data)
        })
}
export function updateYoutubeId({ commit }, payload){
    connections.axiosClient.post(`User/UpdateYoutubeId?id=${payload.id}&youtubeId=${payload.youtubeId}`)
        .then(({ data }) => {
            if (data){
                let message = {
                    title: "Успех",
                    message: "Идентификатор youtube успешно обновлён",
                    style: "alert-success"
                }
                commit("addMessage", message)
                commit("setUserYoutubeId", payload.youtubeId)
                let user_session = cookies.get('user_session')
                user_session.youtubeId = payload.youtubeId
                cookies.set("user_session", user_session, Infinity)
            }
            else {
                let message = {
                    title: "Ошибка",
                    message: "Не удалось обновить идентификатор youtube",
                    style: "alert-danger"
                }
                commit("addMessage", message)
            }
        })
}
export function updateSubChannels({ commit }, payload) {
    connections.axiosClient.post(`User/UpdateSubChannels?id=${payload.id}`,
        { "channels": payload.responseData })
        .then(({ data }) => {
            commit('setLastUpdated', data)
            let message = {
                title: "Успех",
                message: `Список каналов успешно обновлён. Найдено каналов: ${payload.responseData.length}`,
                style: "alert-success"
            }
            commit("addMessage", message)
        });
}
export function getUserData({ commit }, payload){
    connections.axiosClient.get(`User/GetData?email=${payload.email}&youtubeId=${payload.youtubeId}`)
        .then(({ data }) => {
            let states = {"backend":true,"database":true}
            commit('setConnectionStates', states)
            commit('setUserId', data.id)
            commit('setUserYoutubeId', data.youtubeId)
            commit('setUserRole', data.role)
            if (data.subChannelsJson != ""){
                commit('setChannels', JSON.parse(data.subChannelsJson))
            }
            else{
                commit('setChannels')
            }
            commit('setLastUpdated', data.lastChannelsUpdate)
            if (data.folders != ""){
                commit('setFolders', JSON.parse(data.folders))
            }
        })
}
export function updateFolder({ commit }, payload){
    connections.axiosClient.post(`Folder/Update`, payload)
        .then(({ data }) => {
            commit('setFolder', data)
        });
}
export function createFolder({ commit }, payload){
    connections.axiosClient.post(`Folder/Create?id=${payload.id}&name=${payload.name}`)
        .then(({ data }) => {
            commit('addFolder', data)
        });
}
export function deleteFolder({ commit }, payload){
    connections.axiosClient.post(`Folder/Delete?id=${payload.id}&userId=${payload.userId}`)
        .then(({ data }) => {
            if (data == true){
                commit('removeFolder', payload.id)
            }
        });
}
export function setPublicFolders({ commit }, userId){
   connections.axiosClient.get(`Folder/GetPublicFolders?userId=${userId}`)
      .then(({ data }) => {
         if (data != ""){
            commit('setPublicFolders', data)
         }
         else{
            commit('setPublicFolders', [])
        }
      })
}