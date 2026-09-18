import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { DeviceEventEmitter } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

AxiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = await SecureStore.getItemAsync('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    }, 
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return AxiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const accessToken = await SecureStore.getItemAsync("accessToken")
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          accessToken, refreshToken,
        });

        const newToken = data.accessToken;
        await SecureStore.setItemAsync("accessToken", newToken);
        
        if (data.refreshToken) {
          await SecureStore.setItemAsync("refreshToken", data.refreshToken);
        }

        AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return AxiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        DeviceEventEmitter.emit('onUnauthorized');

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);