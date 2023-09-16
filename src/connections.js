import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: "https://foldersdataapi20230916165557.azurewebsites.net/",
  //baseURL: "https://localhost:44389/",
});

export const axiosGoogle = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});
