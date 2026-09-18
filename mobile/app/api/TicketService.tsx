import { AxiosInstance } from "../context/AxiosInstance";

export async function useTicket(id: string, eventId: string) {
      try {
    const response = await AxiosInstance.get(`/tickets/${id}`)
    if(response.data.eventId != eventId) {
        return {msg: "Pogresan dogadjaj", color: "red"}
    }
    if(response.data.isUsed) {
        return {msg: "Tiket je vec iskoriscen", color: "red"};
    }
        const res = await AxiosInstance.post(`/tickets/${id}/use`)
        return {msg: "Uspesno skeniranje", color: "green"}
      } catch (error: any) {
    if (error.response?.status === 404) {
      return {msg: "Pogresan QR kod", color: "red"}
    }}
}