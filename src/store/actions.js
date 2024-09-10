import * as connections from "../connections";
import cookies from 'vue-cookies';
import router from '../router'; // Added router import

export async function updateSubChannels({ commit, dispatch }, responseData) {
    let delegate = async () => {
        let token = cookies.get('token');
        let headers = { 'Authorization': `Bearer ${token}` };
        try {
            const { data } = await connections.axiosClientV1.post(`Users/UpdateSubChannels`, { "channels": responseData }, { headers });
            commit('setLastUpdated', data);
            let message = {
                title: "Успех",
                message: `Список каналов успешно обновлён. Найдено каналов: ${responseData.length}`,
                style: "alert-success"
            };
            commit("addMessage", message);
        } catch (error) {
            console.error('Failed to update sub channels:', error);
            throw error;
        }
    };
    await refreshTokenWrapper(delegate, { commit, dispatch });
}
export async function updateFolder({ commit, dispatch }, payload) {
    let delegate = async () => {
        let token = cookies.get('token');
        let headers = { 'Authorization': `Bearer ${token}` };
        try {
            const { data } = await connections.axiosClientV1.put(`Folders/${payload.folder.guid}`, payload, { headers });
            commit('setFolder', data.folder);
            return data.folder; 
        } catch (error) {
            console.error('Failed to update folder:', error);
            throw error;
        }
    };
    return await refreshTokenWrapper(delegate, { commit, dispatch });
}
export async function createFolder({ commit, dispatch }, payload) {
    let delegate = async () => {
        let token = cookies.get('token');
        let headers = { 'Authorization': `Bearer ${token}` };
        try {
            const { data } = await connections.axiosClientV1.post(`Folders`, { name: payload.name }, { headers });
            commit('addFolder', data.folder);
        } catch (error) {
            console.error('Failed to create folder:', error);
            throw error;
        }
    };
    await refreshTokenWrapper(delegate, { commit, dispatch });
}
export async function deleteFolder({ commit, dispatch }, guid) {
    let delegate = async () => {
        let token = cookies.get('token');
        let headers = { 'Authorization': `Bearer ${token}` };
        try {
            await connections.axiosClientV1.delete(`Folders/${guid}`, { headers });
            commit('removeFolder', guid);
        } catch (error) {
            console.error('Failed to delete folder:', error);
            throw error;
        }
    };
    await refreshTokenWrapper(delegate, { commit, dispatch });
}
export async function authorizeUser({ commit }, accessToken) {
    try {
        const { data } = await connections.axiosClientV1.get(`Authorization?accessToken=${accessToken}`);
        if (data && data.userData) {
            commit('setUser', data.userData);
            cookies.set('token', data.token, Infinity);
            cookies.set('refreshToken', data.refreshToken, Infinity);
        } else {
            console.error('Invalid response from Authorization');
        }
    } catch (error) {
        console.error('Error authorizing user:', error);
    }
}
export async function updateYoutubeId({ commit, dispatch }, payload) {
    let delegate = async () => {
        let token = cookies.get('token');
        if (!token) {
            let message = {
                title: "Ошибка",
                message: "Вы не авторизованы",
                style: "alert-danger"
            }
            commit("addMessage", message)
        }
        let headers = { 'Authorization': `Bearer ${token}` };
        try {
            await connections.axiosClientV1.post(`Users/UpdateYoutubeId`, { youtubeId: payload.youtubeId }, { headers });

            let message = {
                title: "Успех",
                message: "Идентификатор youtube успешно обновлён",
                style: "alert-success"
            }
            commit("addMessage", message)
            commit("setUserYoutubeId", payload.youtubeId)
            let user = JSON.parse(localStorage.getItem('user'))
            user.youtubeId = payload.youtubeId
            localStorage.setItem("user", JSON.stringify(user))
        } catch (error) {
            console.error('Error updating youtube id:', error);
            throw error;
        }
    };
    await refreshTokenWrapper(delegate, { commit, dispatch });
}
export async function getFolders({ commit, dispatch }, userId) {
    let delegate = async () => {
        let token = cookies.get('token');
        let headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        try {
            const { data } = await connections.axiosClientV1.get(`Folders`, { headers });
            commit('updateFolders', data);
        } catch (error) {
            console.error('Error fetching folders:', error);
            throw error;
        }
    };
    await refreshTokenWrapper(delegate, { commit, dispatch });
}
export async function getFolder({ commit, dispatch }, { folderId: folderGuid, info = false, forceRefresh = false }) {
    let delegate = async () => {
        let token = cookies.get('token');
        let headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        let params = {};
        if (info) 
            params.info = info;
        if (forceRefresh !== false) 
            params.forceRefresh = forceRefresh;
        
        try {
            const { data } = await connections.axiosClientV1.get(`Folders/${folderGuid}`, { headers, params });
            return data;
        } catch (error) {
            console.error('Error fetching folder:', error);
            throw error;
        }
    };
    return refreshTokenWrapper(delegate, { commit, dispatch });
}
export async function apiWrapper({ commit }, apiCall) {
    try {
        const result = await apiCall();
        commit('setConnectionStates', { backend: true, database: true });
        return result;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            if (error.response.data.errors && 
                error.response.data.errors.Undefined && 
                error.response.data.errors.Undefined[0].code === "DatabaseException") {
                commit('setConnectionStates', { backend: true, database: false });
            } else {
                commit('setConnectionStates', { backend: true, database: true });
            }
        } else if (error.request) {
            // The request was made but no response was received
            commit('setConnectionStates', { backend: false, database: false });
        } else {
            // Something happened in setting up the request that triggered an Error
            commit('setConnectionStates', { backend: false, database: false });
        }
        throw error;
    }
}
export async function refreshTokenWrapper(delegate, context) {
    try {
        return await apiWrapper(context, delegate);
    } catch (error) {
        if (!(error.response && error.response.status === 401)) {
            throw error; // Rethrow the error if it's not a 401 
        }
        let token = cookies.get('token');
        let refreshToken = cookies.get('refreshToken');
        if (!refreshToken) {
            console.error('No refresh token found');
            await context.dispatch('logout');
            return;
        }
        try {
            const { data } = await apiWrapper(context, () => 
                connections.axiosClientV1.post(`Authorization/RefreshToken`,
                    { refreshToken: refreshToken },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                )
            );
            if (!(data && data.token)) {
                console.error('Failed to refresh token');
                return;
            }
            cookies.set('token', data.token, Infinity);
            cookies.set('refreshToken', data.refreshToken, Infinity);
            return await apiWrapper(context, delegate);
        } catch (refreshError) {
            if (refreshError.response && refreshError.response.status === 400 && (
                refreshError.response.data.errors.refreshToken[0].code === "RefreshTokenNotValid" ||
                refreshError.response.data.errors.refreshToken[0].code === "RefreshTokenExpired")) {
                console.error('Refresh token is not valid.');
                await context.dispatch('logout');
                await apiWrapper(context, delegate);
            } else {
                console.error('Error refreshing token:', refreshError);
            }
        }
    }
}
export async function logout({ commit }) {
    commit('setUser');
    commit('setFolders');
    commit('setLastUpdated');
    cookies.remove('token');
    cookies.remove('refreshToken');
    localStorage.clear();
    // Redirect to home page
    router.push({ name: 'home' }); // Using router to redirect
}