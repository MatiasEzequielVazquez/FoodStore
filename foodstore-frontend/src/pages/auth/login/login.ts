import type { IUser } from "../../../types/IUser";
import { loginUser } from "../../../utils/api";
import { saveUser } from "../../../utils/localStorage";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const mensajeEl = document.getElementById("mensaje") as HTMLParagraphElement;

form.addEventListener("submit", async (e: SubmitEvent): Promise<void> => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const email: string = formData.get("email") as string;
  const password: string = formData.get("password") as string;

  try {
    const usuarioDto = await loginUser(email, password);

    const usuarioLogueado: IUser = {
      id: usuarioDto.id,
      email: usuarioDto.email,
      password: "",
      loggedIn: true,
      celular: usuarioDto.celular ?? "",
      role: usuarioDto.rol === "ADMIN" ? "admin" : "client",
    };

    saveUser(usuarioLogueado);

    if (usuarioLogueado.role === "admin") {
      navigate("/src/pages/admin/home/home.html");
    } else {
      navigate("/src/pages/client/home/home.html");
    }

  } catch (error) {
    mensajeEl.textContent = "Email o contraseña incorrectos.";
    mensajeEl.style.color = "red";
  }
});

