import type { CartItem } from "../../../types/product";
import { protegerRuta, cerrarSesion } from "../../../utils/auth";
import { createOrder, updateUser } from "../../../utils/api";
// Guard: solo usuarios autenticados
protegerRuta("client");

// ── Referencias al DOM ──
const carritoContenido = document.querySelector<HTMLDivElement>("#carritoContenido");
const contadorCarrito = document.querySelector<HTMLSpanElement>("#contadorCarrito");
const btnCerrarSesion = document.querySelector<HTMLButtonElement>("#btnCerrarSesion");

let mensajeEl: HTMLParagraphElement | null = null;

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

    const btnConfirmar = document.createElement("button");
    btnConfirmar.textContent = "Confirmar pedido";
    btnConfirmar.classList.add("btn-confirmar");
    btnConfirmar.style.marginTop = "1rem";
    btnConfirmar.addEventListener("click", (): void => { mostrarModalCheckout(); });
    carritoContenido.appendChild(btnConfirmar);

    mensajeEl = document.createElement("p");
    mensajeEl.classList.add("mensaje");
    carritoContenido.appendChild(mensajeEl);
};

// ── Mostrar modal de checkout ──
const mostrarModalCheckout = (): void => {
    const userData = localStorage.getItem("userData");
    if (!userData) return;
    const usuario = JSON.parse(userData);
    const carrito = obtenerCarrito();
    const total = calcularTotal(carrito);

    const overlay = document.createElement("div");
    overlay.id = "modalOverlay";

    const modal = document.createElement("div");
    modal.classList.add("modal-checkout");

    const titulo = document.createElement("h2");
    titulo.textContent = "Completar pedido";
    modal.appendChild(titulo);

    const inputTelefono = document.createElement("input");
    inputTelefono.type = "tel";
    inputTelefono.placeholder = "Teléfono de contacto";
    inputTelefono.value = usuario.celular || "";

    const selectPago = document.createElement("select");
    const opcionesPago = ["EFECTIVO", "TARJETA", "TRANSFERENCIA"];
    opcionesPago.forEach((opcion: string): void => {
        const optionEl = document.createElement("option");
        optionEl.value = opcion;
        optionEl.textContent = opcion;
        selectPago.appendChild(optionEl);
    });

    const totalEl = document.createElement("p");
    totalEl.textContent = `Total a pagar: $${total.toLocaleString("es-AR")}`;
    totalEl.style.fontWeight = "bold";

    const errorEl = document.createElement("p");
    errorEl.style.color = "red";

    const btnConfirmarModal = document.createElement("button");
    btnConfirmarModal.textContent = "Confirmar Pedido";
    btnConfirmarModal.classList.add("btn-confirmar-modal");
    btnConfirmarModal.addEventListener("click", async (): Promise<void> => {
        const telefono = inputTelefono.value.trim();
        const formaPago = selectPago.value;

        if (!telefono) {
            errorEl.textContent = "El teléfono es obligatorio para confirmar el pedido.";
            return;
        }

        if (usuario.celular && telefono !== usuario.celular) {
            const confirmCambio = confirm("El teléfono ingresado es diferente al registrado en tu perfil. ¿Querés actualizarlo?");
            if (!confirmCambio) {
                errorEl.textContent = "Cancelaste la actualización del teléfono. Podés modificarlo o usar el número registrado.";
                return;
            }
        }

        if (telefono !== (usuario.celular ?? "")) {
            await updateUser(usuario.id, { celular: telefono });
            localStorage.setItem("userData", JSON.stringify({ ...usuario, celular: telefono }));
        }

        try {
            const detallePedido = carrito.map((item: CartItem) => ({
                idProducto: item.id,
                cantidad: item.cantidad,
            }));

            await createOrder({
                estado: "PENDIENTE",
                formaPago,
                idUsuario: usuario.id,
                detallePedido,
            });

            localStorage.removeItem("carrito");
            modalRoot.removeChild(overlay);
            window.location.href = "../home/home.html";
        } catch (error) {
            errorEl.textContent = "Hubo un error al confirmar el pedido. Por favor, intentá nuevamente.";
        }
    });

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "Cancelar";
    btnCancelar.classList.add("btn-cancelar-modal");
    btnCancelar.addEventListener("click", (): void => {
        modalRoot.removeChild(overlay);
    });

    modal.appendChild(inputTelefono);
    modal.appendChild(selectPago);
    modal.appendChild(totalEl);
    modal.appendChild(errorEl);
    modal.appendChild(btnConfirmarModal);
    modal.appendChild(btnCancelar);
    overlay.appendChild(modal);
    const modalRoot = document.getElementById("modal-root")!;
    modalRoot.appendChild(overlay);

};

// ── Inicialización ──
renderCarrito();
