import axios from 'axios'

export const axiosClient = axios.create({
  // baseURL:  "https://folderdataapi.somee.com/" 
  baseURL:  "http://localhost:5082/" 
   });

export const axiosGoogle = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});
