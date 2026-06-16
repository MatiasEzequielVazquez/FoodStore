import type { IUser } from "../../../types/IUser";
import { getUsers, saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const mensajeEl = document.getElementById("mensaje") as HTMLParagraphElement;

form.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget as HTMLFormElement);

  const email: string = formData.get("email") as string;
  const password: string = formData.get("password") as string;

  // Busca en el array de usuarios si existe coincidencia de email Y password
  const users: IUser[] = getUsers();

  const usuario: IUser | undefined = users.find(
    (u: IUser) => u.email === email && u.password === password
  );

  if (usuario) {
    // Credenciales correctas > guarda sesión y redirige según el rol
    const usuarioLogueado: IUser = { ...usuario, loggedIn: true };
    saveUser(usuarioLogueado);

    if (usuarioLogueado.role === "admin") {
      navigate("/src/pages/admin/home/home.html");
    } else {
      navigate("/src/pages/client/home/home.html");
    }

  } else {
    // Credenciales incorrectas > muestra error
    mensajeEl.textContent = "Email o contraseña incorrectos.";
    mensajeEl.style.color = "red";
  }
});

