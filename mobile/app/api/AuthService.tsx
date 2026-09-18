import { AxiosInstance } from "../context/AxiosInstance";
import * as SecureStore from 'expo-secure-store';

const ROLEID = process.env.EXPO_PUBLIC_ROLEID;

export async function login(email: string, password: string) {
  const response = await AxiosInstance.post("/auth/login", { email, password });
  if (response.data) {
    await SecureStore.setItemAsync("accessToken", response.data.accessToken);
    await SecureStore.setItemAsync("refreshToken", response.data.refreshToken);

    const res = await AxiosInstance.get("/auth/me");
    if(!(res.data.roleId.toLowerCase() == ROLEID.toLowerCase())) {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
        throw new Error("UNAUTHORIZED")
    }
    return response.data;
  }
  throw new Error("UNAUTHORIZED");
}

export async function logout() {

    try {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");
      
        if (refreshToken) {
            await AxiosInstance.post("/auth/logout", { accessToken, refreshToken });
        }
    } catch (error) {
        console.warn("Server logout request failed:", error);
    } finally {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
    }
}