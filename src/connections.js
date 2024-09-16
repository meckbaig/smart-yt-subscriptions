import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: mainDomain + "/api"
});

export const axiosClientV1 = axios.create({
  baseURL: mainDomain + "/api/v1"
});

const mainDomain = process.env.NODE_ENV === 'production' 
    ? "https://www.smart-youtube-subscriptions-backend.ru" 
    : "https://localhost:7150"