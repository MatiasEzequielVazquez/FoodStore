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

export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categorias`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("No se pudieron obtener las categorías");
  }
  return response.json();
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/productos`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos");
  }
  return response.json();
};

export const getProductsByCategory = async (categoriaId: number) => {
  const response = await fetch(`${API_URL}/productos/categoria/${categoriaId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("No se pudieron obtener los productos de la categoría");
  }
  return response.json();
};

export const createOrder = async (data: {estado: string; formaPago: string; idUsuario: number; detallePedido: { idProducto: number; cantidad: number }[];}) => {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("No se pudo registrar el pedido");
  }
  return response.json();
};


export const getOrdersByUser = async (userId: number) => {
  const response = await fetch(`${API_URL}/pedidos/usuario/${userId}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("No se pudieron obtener los pedidos del usuario");
  }
  return response.json();
};


export const deleteProduct = async (id: number) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("No se pudo eliminar el producto");
  }
};

export const createProduct = async (data: { nombre: string; descripcion: string; precio: number; stock: number; imagen: string; disponible: boolean; idCategoria: number }) => {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("No se pudo registrar el producto");
  }
  return response.json();
};


export const updateProduct = async (id: number, data: { nombre: string; descripcion: string; precio: number; stock: number; imagen: string; disponible: boolean; idCategoria: number }) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("No se pudo actualizar el producto");
  }
  return response.json();
};

export const getProductById = async (id: number) => {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("No se pudo obtener el producto");
  }
  return response.json();
};

export const getAllOrders = async () => {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: "GET",
  });
  if (!response.ok) {
    throw new Error("No se pudieron obtener los pedidos");
  }
  return response.json();
};

export const updateOrderStatus = async (id: number, estado: string) => {
  const response = await fetch(`${API_URL}/pedidos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado }),
  });
  if (!response.ok) {
    throw new Error("No se pudo actualizar el estado del pedido");
  }
  return response.json();
};
