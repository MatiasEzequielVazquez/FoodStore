import { PRODUCTS } from "./data/data";

// Inicializa los productos en localStorage la primera vez que carga la app
// Si ya existen (por cambios del admin), no los sobreescribe
if (!localStorage.getItem("productos")) {
    localStorage.setItem("productos", JSON.stringify(PRODUCTS));
}
