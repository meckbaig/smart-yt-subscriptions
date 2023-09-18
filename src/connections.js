import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
  ? "https://folderdataapi.somee.com/" 
  : "https://localhost:44389/" });

export const axiosGoogle = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3/",
});
