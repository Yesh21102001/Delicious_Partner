import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://192.168.29.186:2000/api", // Replace with your actual backend port
  timeout: 5000,
});

export default axiosInstance;
