import axios from "axios";
import cookies from "js-cookie";

const axiosApi = axios.create({
  baseURL: "http://localhost:8888/",
});

export const setAuthHeader = (token: any) => {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Set the initial header from storage or something (should surround with try catch in actual app)
setAuthHeader(cookies.get("token"));

export default axiosApi;
