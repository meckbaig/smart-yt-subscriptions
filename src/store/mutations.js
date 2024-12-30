import router from '../router'

export function setUser(state, user){
  state.user = user || []
}

export function setUserChannels(state, channels){
  state.user.subChannels = channels || []
  localStorage.setItem('user', JSON.stringify(state.user));
}

export function setConnectionStates(state, { backend, database }) {
  state.connectionStates = {
    backend: backend,
    database: database
  };
}

export function setTheme(state, theme){
  state.theme = theme || ''
}

export function setFolder(state, folder){
  let index = state.folders.findIndex(x => x.guid == folder.guid);
  state.folders[index] = folder 
}

export function addFolder(state, folder){
  state.folders.unshift(folder)
  router.push({
    name: "editFolder",
    params: { "folder": folder.guid }
 })
}

export function removeFolder(state, folderGuid){
  let index = state.folders.findIndex(x => x.guid == folderGuid);
  state.folders.splice(index, 1)
}

export function setFolders(state, folders){
  state.folders = folders || []
}

export function setPublicFolders(state, publicFolders){
  state.publicFolders = publicFolders || []
}

export function addMessage(state, message){
  state.messages.push(message)
}

export function removeMessage(state, message){
  let index = state.messages.findIndex(m => m == message);
  state.messages.splice(index, 1)
}

export function updateFolders(state, data) {
  if (data.personalFolders) {
    state.folders = data.personalFolders
  }
  if (data.publicFolders) {
    state.publicFolders = data.publicFolders
  }
}

export function setSnowEnabled(state, enabled) {
  state.snowEnabled = enabled;
}
