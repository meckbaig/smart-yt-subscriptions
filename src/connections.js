import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? "https://www.syts-backend.ru/" 
    : "https://localhost:7150" 
   });

export const axiosGoogle = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});
