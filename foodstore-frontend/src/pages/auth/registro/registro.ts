import { registerUser } from "../../../utils/api";
import { navigate } from "../../../utils/navigate";

const form = document.getElementById("form") as HTMLFormElement;
const mensajeEl = document.getElementById("mensaje") as HTMLParagraphElement;

form.addEventListener("submit", async (e: SubmitEvent): Promise<void> => {
  e.preventDefault();

  // FormData extrae los valores de los inputs que tengan atributo name
  const formData = new FormData(e.currentTarget as HTMLFormElement);

  const email: string = formData.get("email") as string;
  const password: string = formData.get("password") as string;
  const confirmar: string = formData.get("confirmar") as string;
  const nombre: string = formData.get("nombre") as string;
  const apellido: string = formData.get("apellido") as string;
  const celular: string = formData.get("celular") as string;

  // Validación: las contraseñas deben coincidir
  if (password !== confirmar) {
    mensajeEl.textContent = "Las contraseñas no coinciden.";
    mensajeEl.style.color = "red";
    return;
  }

  try {
    await registerUser({ nombre, apellido, email, celular, password });

    mensajeEl.textContent = "¡Cuenta creada! Redirigiendo...";
    mensajeEl.style.color = "green";

    setTimeout((): void => {
      navigate("/src/pages/auth/login/login.html");
    }, 1500);
  } catch (error) {
    mensajeEl.textContent = "Error al crear la cuenta.";
    mensajeEl.style.color = "red";
  }
});

