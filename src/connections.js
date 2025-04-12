import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: mainDomain() + "/api"
});

export const axiosClientV1 = axios.create({
  baseURL: mainDomain() + "/api/v1"
});

function mainDomain() {
  return process.env.NODE_ENV === 'production' 
    ? import.meta.env.VITE_PRODUCTION_DOMAIN
    : "https://localhost:7150";
}