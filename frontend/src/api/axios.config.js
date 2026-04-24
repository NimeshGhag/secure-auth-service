import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const instance = axios.create({
  baseURL: `/api`,
  withCredentials: true,
});

export default instance;
