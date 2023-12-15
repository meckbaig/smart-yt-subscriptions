import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? "https://www.syts-backend.ru/" : "https://www.syts-backend.ru/" 
   });

export const axiosGoogle = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});
