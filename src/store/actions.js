import * as connections from "../connections";

export function getConnectionState({ commit }) {
    connections.axiosClient.get(`auth/GetConnectionState`)
        .then(({ data }) => {
            commit('setConnectionStates', data)
        })
}
export function updateSubChannels({ commit }, payload) {
    connections.axiosClient.post(`Auth/UpdateSubChannels?id=${payload.id}`,
        { "channels": payload.responseData })
        .then(({ data }) => {
            commit('setLastUpdated', data)
        });
}
export function getUserData({ commit }, payload){
    connections.axiosClient.get(`Auth/GetUserData?email=${payload.email}&id=${payload.id}`)
        .then(({ data }) => {
            commit('setUserRole', data.role)
            commit('setChannels', JSON.parse(data.subChannelsJson))
            commit('setLastUpdated', data.lastChannelsUpdate)
            if (data.folders != ""){
                commit('setFolders', JSON.parse(data.folders))
            }
        })
}
export function updateFolder({ commit }, payload){
    connections.axiosClient.post(`Auth/UpdateFolder`, payload)
        .then(({ data }) => {
            commit('setFolder', data)
        });
}
export function createFolder({ commit }, payload){
    connections.axiosClient.post(`Auth/CreateFolder?id=${payload.id}&name=${payload.name}`)
        .then(({ data }) => {
            commit('addFolder', data)
        });
}
export function deleteFolder({ commit }, payload){
    connections.axiosClient.post(`Auth/DeleteFolder?id=${payload.id}&userId=${payload.userId}`)
        .then(({ data }) => {
            if (data == true){
                commit('removeFolder', payload.id)
            }
        });
}
export function setPublicFolders({ commit }, userId){
   connections.axiosClient.get(`Auth/GetPublicFolders?userId=${userId}`)
      .then(({ data }) => {
         if (data != ""){
            commit('setPublicFolders', data)
         }
      })
}