const API_URL = "http://localhost:8080/api";

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/usuarios/login?email=${email}&password=${password}`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error("Credenciales inválidas");
  }
  return response.json();
};

export const registerUser = async (data: { nombre: string; apellido: string; email: string; celular: string; password: string }) => {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("No se pudo registrar el usuario");
  }
  return response.json();
};