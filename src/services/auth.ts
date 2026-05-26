import { request } from "../utils/apiClient";
import { setToken } from "../utils/token";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export async function register(name: string, email: string, password: string) {
  return request<{ message: string; email: string }>("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export async function verifyOtp(
  email: string,
  otp: string,
): Promise<AuthResponse> {
  const data = await request<{ message: string } & AuthResponse>(
    "/auth/verify-otp",
    {
      method: "POST",
      body: { email, otp },
    },
  );
  setToken(data.token);
  return data;
}

export async function resendOtp(email: string) {
  return request<{ message: string }>("/auth/resend-otp", {
    method: "POST",
    body: { email },
  });
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  setToken(data.token);
  return data;
}

export async function forgotPassword(email: string) {
  return request<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: { email },
  });
}

export async function resetPassword(
  email: string,
  otp: string,
  password: string,
) {
  return request<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: { email, otp, password },
  });
}
