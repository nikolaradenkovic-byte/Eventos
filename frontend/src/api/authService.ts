import type { User } from "@shared/types/User";
import { users } from "../data/users";
import { ApiClient } from "./apiClient";
import type { LoginRequest } from "@shared/types/LoginRequest";
import type { LoginResponse } from "@shared/types/LoginResponse";
import { AuthStatus } from "../shared/constants/AuthStatus";

export async function login(credentials: LoginRequest): Promise<string> {
  try {
    const response = await ApiClient.post<LoginResponse>(
      "/api/auth/login",
      credentials,
    );

    if (response.data) {
      localStorage.setItem("accessToken", response.data.accessToken);

      localStorage.setItem("refreshToken", response.data.refreshToken);

      return AuthStatus.AUTHORIZED;
    } else {
      return AuthStatus.UNAUTHORIZED;
    }
  } catch (error) {
    console.error(error);
    return AuthStatus.ERROR;
  }
}

type RegisterRequest = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};

export async function register(data: RegisterRequest): Promise<boolean> {
  try {
    const response = await ApiClient.post("/api/auth/register", data);

    return response.status === 200;
  } catch (error) {
    console.error(error);
    return false;
  }
}
