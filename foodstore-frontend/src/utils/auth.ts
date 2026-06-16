import type { IUser } from "../types/IUser";
import type { Rol } from "../types/Rol";
import { getUSer, removeUser } from "./localStorage";
import { navigate } from "./navigate";

export const checkAuhtUser = (
  redireccion1: string,
  redireccion2: string,
  rol: Rol
) => {
  const user = getUSer();

  if (!user) {
    navigate(redireccion1);
    return;
  } else {
    const parseUser: IUser = JSON.parse(user);
    if (parseUser.role !== rol) {
      navigate(redireccion2);
      return;
    }
  }
};

export const logout = () => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
};

// Alias para el store: protege una ruta según el rol requerido
// Si no hay sesión > login. Si el rol no coincide > redirecciona.
export const protegerRuta = (rolRequerido: Rol): void => {
  const datos: string | null = getUSer();

  if (!datos) {
    navigate("/src/pages/auth/login/login.html");
    return;
  }

  const usuario: IUser = JSON.parse(datos) as IUser;

  if (usuario.role !== rolRequerido) {
    if (usuario.role === "admin") {
      navigate("/src/pages/store/admin/admin.html");
    } else {
      navigate("/src/pages/store/home/home.html");
    }
  }
};

export const cerrarSesion = (): void => {
  removeUser();
  navigate("/src/pages/auth/login/login.html");
};
