import { AxiosInstance } from "../context/AxiosInstance";

export async function MyEvents() {
    const response = await AxiosInstance.get(`/events/controller`);
    return response.data;
}