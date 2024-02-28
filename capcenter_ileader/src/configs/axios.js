import axios from "axios";


export const axiosClient = axios.create({
  baseURL: "https://miniapp.ileader.vn/api",
});