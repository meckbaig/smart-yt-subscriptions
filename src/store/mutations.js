import router from '../router'

export function setUser(state, user){
  state.user = user || []
}
export function setUserRole(state, role){
  state.user.role = role || ''
}
export function setUserId(state, id){
  state.user.id = id || ''
}
export function setUserYoutubeId(state, youtubeId){
  state.user.youtubeId = youtubeId || ''
}
export function setChannels(state, channels){
  state.channels = channels || []
}
export function concatChannels(state, channels){
  state.channels = state.channels.concat(channels) || state.channels
}
export function setLastUpdated(state, lastUpdated){
  state.lastUpdated = lastUpdated || ''
}
export function setConnectionStates(state, connectionStates){
  state.connectionStates = connectionStates || ''
}
export function setTheme(state, theme){
  state.theme = theme || ''
}
export function setFolder(state, folder){
  let index = state.folders.findIndex(x => x.id == folder.id);
  state.folders[index] = folder 
}
export function addFolder(state, folder){
  state.folders.push(folder)
  router.push({
    name: "editFolder",
    params: { "folder": folder.id }
 })
}
export function removeFolder(state, folderId){
  let index = state.folders.findIndex(x => x.id == folderId);
  state.folders.splice(index, 1)
}
export function setFolders(state, folders){
  state.folders = folders || []
}
export function setPublicFolders(state, publicFolders){
  // if (publicFolders.length){
    state.publicFolders = publicFolders || []
  // }
  // else{
  //   state.publicFolders = state.publicFolders.concat(publicFolders)
  // }
}
export function addMessage(state, message){
  state.messages.push(message)
}
export function removeMessage(state, message){
  let index = state.messages.findIndex(m => m == message);
  state.messages.splice(index, 1)
}