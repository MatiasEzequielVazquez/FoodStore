import type { IUser } from "../types/IUser";
import type { Product } from "../types/product";
import { PRODUCTS } from "../data/data";

// --- Sesion activa (userData) ---

export const saveUser = (user: IUser): void => {
  localStorage.setItem("userData", JSON.stringify(user));
};

export const getUSer = (): string | null => {
  return localStorage.getItem("userData");
};

export const removeUser = (): void => {
  localStorage.removeItem("userData");
};

// --- Array de usuarios registrados (users) ---

export const getUsers = (): IUser[] => {
  const datos: string | null = localStorage.getItem("users");

  if (datos) {
    return JSON.parse(datos) as IUser[];
  }

  const adminPorDefecto: IUser = {
    email: "admin@foodstore.com",
    password: "admin1234",
    loggedIn: false,
    role: "admin"
  };

  const iniciales: IUser[] = [adminPorDefecto];
  localStorage.setItem("users", JSON.stringify(iniciales));
  return iniciales;
};

export const saveUsers = (users: IUser[]): void => {
  localStorage.setItem("users", JSON.stringify(users));
};

// --- Productos (productos) ---
// Si ya existe en localStorage lo devuelve, si no inicializa desde data.ts

export const getProductos = (): Product[] => {
  const datos: string | null = localStorage.getItem("productos");
  if (datos) {
    return JSON.parse(datos) as Product[];
  }
  // Primera vez > carga desde data.ts y persiste
  localStorage.setItem("productos", JSON.stringify(PRODUCTS));
  return PRODUCTS;
};

export const saveProductos = (productos: Product[]): void => {
  localStorage.setItem("productos", JSON.stringify(productos));
};
