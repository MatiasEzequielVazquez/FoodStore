import type { IUser } from "../types/IUser";

// --- Sesion activa (userData) ---

export const saveUser = (user: IUser): void => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const getUser = (): string | null => {
  return localStorage.getItem("userData");
};

export const removeUser = (): void => {
  localStorage.removeItem("userData");
};

