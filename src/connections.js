import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: mainDomain() + "/api"
});

export const axiosClientV1 = axios.create({
  baseURL: mainDomain() + "/api/v1"
});

function mainDomain() {
    return process.env.NODE_ENV === 'production' 
        ? "https://smart-youtube-subscriptions-backend.ru" 
        : "https://localhost:7150";
}