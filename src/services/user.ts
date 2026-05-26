import { request } from "../utils/apiClient";
import { setToken } from "../utils/token";

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

export async function getProfile(): Promise<UserProfile> {
  const data = await request<{ user: UserProfile }>("/user/me", { auth: true });
  return data.user;
}

export type UpdateProfileOptions = {
  name?: string;
  new_password?: string;
  current_password?: string;
};

export async function updateProfile(
  options: UpdateProfileOptions,
): Promise<UserProfile> {
  const data = await request<{
    message: string;
    token: string;
    user: UserProfile;
  }>("/user/me", { method: "PUT", body: options, auth: true });
  setToken(data.token);
  return data.user;
}

export async function deleteAccount(password: string): Promise<void> {
  await request<{ message: string }>("/user/me", {
    method: "DELETE",
    body: { password },
    auth: true,
  });
}
