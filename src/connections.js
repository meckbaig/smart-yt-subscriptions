import axios from 'axios'

export const axiosClient = axios.create({
  baseURL:  "https://folderdataapi.somee.com/" 
   });

export const axiosGoogle = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});
