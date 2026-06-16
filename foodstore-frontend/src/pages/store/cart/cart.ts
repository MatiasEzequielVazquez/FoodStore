import type { CartItem } from "../../../types/product";
import { protegerRuta, cerrarSesion } from "../../../utils/auth";

// Guard: solo usuarios autenticados
protegerRuta("client");

// ── Referencias al DOM ──
const carritoContenido = document.querySelector<HTMLDivElement>("#carritoContenido");
const contadorCarrito = document.querySelector<HTMLSpanElement>("#contadorCarrito");
const btnCerrarSesion = document.querySelector<HTMLButtonElement>("#btnCerrarSesion");

btnCerrarSesion?.addEventListener("click", (): void => {
    cerrarSesion();
});

// ── Obtener carrito desde localStorage ──
const obtenerCarrito = (): CartItem[] => {
    const datos: string | null = localStorage.getItem("carrito");
    if (datos) {
        return JSON.parse(datos) as CartItem[];
    }
    return [];
};

// ── Guardar carrito en localStorage ──
const guardarCarrito = (items: CartItem[]): void => {
    localStorage.setItem("carrito", JSON.stringify(items));
};

// ── Calcular total de la compra ──
const calcularTotal = (items: CartItem[]): number => {
    return items.reduce(
        (acc: number, item: CartItem) => acc + item.precio * item.cantidad,
        0
    );
};

// ── Actualizar el contador del header ──
const actualizarContador = (items: CartItem[]): void => {
    const total: number = items.reduce(
        (acc: number, item: CartItem) => acc + item.cantidad, 0
    );
    if (contadorCarrito) {
        contadorCarrito.textContent = total.toString();
    }
};

// ── Cambiar cantidad de un item ──
const cambiarCantidad = (id: number, delta: number): void => {
    const carrito: CartItem[] = obtenerCarrito();

    const item: CartItem | undefined = carrito.find(
        (i: CartItem) => i.id === id
    );

    if (!item) return;

    item.cantidad += delta;

    // Si la cantidad llega a 0, elimina el item
    const carritoActualizado: CartItem[] = carrito.filter(
        (i: CartItem) => i.cantidad > 0
    );

    guardarCarrito(carritoActualizado);
    renderCarrito();
};

// ── Vaciar carrito completo ──
const vaciarCarrito = (): void => {
    localStorage.removeItem("carrito");
    renderCarrito();
};

// ── Renderizar el carrito ──
const renderCarrito = (): void => {
    if (!carritoContenido) return;

    const carrito: CartItem[] = obtenerCarrito();
    actualizarContador(carrito);
    carritoContenido.innerHTML = "";

    if (carrito.length === 0) {
        carritoContenido.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío.</p>
                <a href="../home/home.html">← Volver al catálogo</a>
            </div>
        `;
        return;
    }

    // Renderiza cada item
    carrito.forEach((item: CartItem): void => {
        const div = document.createElement("div");
        div.classList.add("carrito-item");

        div.innerHTML = `
            <div class="carrito-item-info">
                <h3>${item.nombre}</h3>
                <p>$${item.precio.toLocaleString("es-AR")} c/u</p>
            </div>
            <div class="carrito-item-acciones">
                <button class="btn-menos" data-id="${item.id}">−</button>
                <span class="carrito-item-cantidad">${item.cantidad}</span>
                <button class="btn-mas" data-id="${item.id}">+</button>
            </div>
            <span class="carrito-item-subtotal">
                $${(item.precio * item.cantidad).toLocaleString("es-AR")}
            </span>
        `;

        // Botón restar
        div.querySelector<HTMLButtonElement>(".btn-menos")?.addEventListener(
            "click", (): void => cambiarCantidad(item.id, -1)
        );

        // Botón sumar
        div.querySelector<HTMLButtonElement>(".btn-mas")?.addEventListener(
            "click", (): void => cambiarCantidad(item.id, 1)
        );

        carritoContenido.appendChild(div);
    });

    // Total general
    const total: number = calcularTotal(carrito);

    const totalDiv = document.createElement("div");
    totalDiv.classList.add("carrito-total");
    totalDiv.innerHTML = `
        <span>Total de la compra:</span>
        <span>$${total.toLocaleString("es-AR")}</span>
    `;
    carritoContenido.appendChild(totalDiv);

    // Botón vaciar
    const btnVaciar = document.createElement("button");
    btnVaciar.textContent = "Vaciar carrito";
    btnVaciar.classList.add("btn-vaciar");
    btnVaciar.style.marginTop = "1rem";
    btnVaciar.addEventListener("click", (): void => vaciarCarrito());
    carritoContenido.appendChild(btnVaciar);
};

// ── Inicialización ──
renderCarrito();
