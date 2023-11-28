import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? "http://syts-backend.ru/" : "http://syts-backend.ru/" 
   });

export const axiosGoogle = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});
