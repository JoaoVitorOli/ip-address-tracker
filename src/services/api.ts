import axios from "axios";

const api = axios.create({
  baseURL: " https://geo.ipify.org/"
});

export default api;
