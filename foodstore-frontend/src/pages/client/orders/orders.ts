import { protegerRuta, cerrarSesion } from "../../../utils/auth";
import { getOrdersByUser } from "../../../utils/api";
import type { IPedidoDto } from "../../../types/IBackendDtos";

protegerRuta("client");

const pedidosContenido = document.querySelector<HTMLDivElement>("#pedidosContenido");
const btnCerrarSesion = document.querySelector<HTMLButtonElement>("#btnCerrarSesion");

btnCerrarSesion?.addEventListener("click", (): void => {
    cerrarSesion();
});

const renderPedidos = (pedidos: IPedidoDto[]): void => {
    if (!pedidosContenido) return;
    pedidosContenido.innerHTML = "";

    if (pedidos.length === 0) {
        pedidosContenido.innerHTML = `
            <div class="carrito-vacio">
                <p>Todavía no realizaste ningún pedido.</p>
                <a href="../../store/home/home.html">← Ir al catálogo</a>
            </div>
        `;
        return;
    }

    pedidos.forEach((pedido: IPedidoDto): void => {
        const div = document.createElement("div");
        div.classList.add("pedido-card");

        const detallesHtml: string = pedido.detalles
            .map(
                (detalle) => `
                    <div class="pedido-detalle-item">
                        <span>${detalle.cantidad}x ${detalle.producto.nombre}</span>
                        <span>$${detalle.subtotal.toLocaleString("es-AR")}</span>
                    </div>
                `
            )
            .join("");

        div.innerHTML = `
            <div class="pedido-header">
                <span class="pedido-numero">Pedido #${pedido.id}</span>
                <span class="pedido-estado pedido-estado-${pedido.estado.toLowerCase()}">${pedido.estado}</span>
            </div>
            <p class="pedido-fecha">${pedido.fecha}</p>
            <div class="pedido-detalles">
                ${detallesHtml}
            </div>
            <div class="pedido-total">
                <span>Total:</span>
                <span>$${pedido.total.toLocaleString("es-AR")}</span>
            </div>
        `;

        pedidosContenido.appendChild(div);
    });
};

const init = async (): Promise<void> => {
    const userData = localStorage.getItem("userData");
    if (!userData) return;
    const usuario = JSON.parse(userData);

    const pedidos: IPedidoDto[] = await getOrdersByUser(usuario.id);
    renderPedidos(pedidos);
};

init();