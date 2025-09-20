import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8001/api/auth", // backend base
  withCredentials: true, // send cookies automatically
});

export default instance;
