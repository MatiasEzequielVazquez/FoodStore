import type { IUser } from "../../../types/IUser";
import { getUsers, saveUsers } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const mensajeEl = document.getElementById("mensaje") as HTMLParagraphElement;

form.addEventListener("submit", (e: SubmitEvent): void => {
  e.preventDefault();

  // FormData extrae los valores de los inputs que tengan atributo name
  const formData = new FormData(e.currentTarget as HTMLFormElement);

  const email: string = formData.get("email") as string;
  const password: string = formData.get("password") as string;
  const confirmar: string = formData.get("confirmar") as string;

  // Validación: las contraseñas deben coincidir
  if (password !== confirmar) {
    mensajeEl.textContent = "Las contraseñas no coinciden.";
    mensajeEl.style.color = "red";
    return;
  }

  const users: IUser[] = getUsers();

  // Verificación de duplicado
  const yaExiste: IUser | undefined = users.find(
    (u: IUser) => u.email === email
  );

  if (yaExiste) {
    mensajeEl.textContent = "Ese email ya está registrado.";
    mensajeEl.style.color = "red";
    return;
  }

  // Crea el nuevo usuario con la interfaz IUser
  const nuevoUsuario: IUser = {
    email: email,
    password: password,
    loggedIn: false,
    role: "client"   // todos se registran como client por defecto
  };

  users.push(nuevoUsuario);
  saveUsers(users);

  mensajeEl.textContent = "¡Cuenta creada! Redirigiendo...";
  mensajeEl.style.color = "green";

  setTimeout((): void => {
    navigate("/src/pages/auth/login/login.html");
  }, 1500);
});
