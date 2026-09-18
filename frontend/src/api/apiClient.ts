import axios from "axios";

const apiURL =
  "https://eventosapi-abeueqcbg8grcqfe.austriaeast-01.azurewebsites.net";

export const ApiClient = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

ApiClient.interceptors.request.use((config) => {
  const currentAccessToken: string | null = localStorage.getItem("accessToken");

  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});
