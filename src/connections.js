import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? "https://www.syts-backend.ru/" : "http://localhost:5082" 
   });

export const axiosGoogle = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});
