import { getCategories } from "../../../data/data";
import type { Product } from "../../../types/product";
import type { ICategory } from "../../../types/category";
import type { CartItem } from "../../../types/product";
import { protegerRuta, cerrarSesion } from "../../../utils/auth";
import { getProductos } from "../../../utils/localStorage";

// Guard: solo usuarios autenticados acceden al catálogo
protegerRuta("client");

// ── Referencias al DOM ──
const contenedor = document.querySelector<HTMLElement>("#contenedorProductos");
const listaCategorias = document.querySelector<HTMLUListElement>("#listaCategorias");
const inputBusqueda = document.querySelector<HTMLInputElement>("#inputBusqueda");
const btnBuscar = document.querySelector<HTMLButtonElement>("#btnBuscar");
const tituloCatalogo = document.querySelector<HTMLHeadingElement>("#tituloCatalogo");
const contadorCarrito = document.querySelector<HTMLSpanElement>("#contadorCarrito");
const toast = document.querySelector<HTMLDivElement>("#toast");
const btnCerrarSesion = document.querySelector<HTMLButtonElement>("#btnCerrarSesion");

// ── Estado de la app ──
let categoriaActiva: number | null = null;
let textoBusqueda: string = "";

// ── Cerrar sesión ──
btnCerrarSesion?.addEventListener("click", (): void => {
    cerrarSesion();
});

// ── Carrito: obtener desde localStorage ──
const obtenerCarrito = (): CartItem[] => {
    const datos: string | null = localStorage.getItem("carrito");
    if (datos) {
        return JSON.parse(datos) as CartItem[];
    }
    return [];
};

// ── Carrito: guardar en localStorage ──
const guardarCarrito = (items: CartItem[]): void => {
    localStorage.setItem("carrito", JSON.stringify(items));
};

// ── Carrito: agregar producto ──
const agregarAlCarrito = (producto: Product): void => {
    const carrito: CartItem[] = obtenerCarrito();

    const itemExistente: CartItem | undefined = carrito.find(
        (item: CartItem) => item.id === producto.id
    );

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        const nuevoItem: CartItem = {
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        };
        carrito.push(nuevoItem);
    }

    guardarCarrito(carrito);
    actualizarContador();
    mostrarToast(`"${producto.nombre}" agregado al carrito 🛒`);
};

// ── Actualiza el contador del header ──
const actualizarContador = (): void => {
    const carrito: CartItem[] = obtenerCarrito();
    const total: number = carrito.reduce(
        (acc: number, item: CartItem) => acc + item.cantidad, 0
    );
    if (contadorCarrito) {
        contadorCarrito.textContent = total.toString();
    }
};

// ── Toast de confirmación visual ──
const mostrarToast = (mensaje: string): void => {
    if (!toast) return;
    toast.textContent = mensaje;
    toast.classList.add("visible");
    setTimeout((): void => {
        toast.classList.remove("visible");
    }, 2000);
};

// ── Renderizar productos ──
const renderProductos = (productos: Product[]): void => {
    if (!contenedor) return;
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `<p class="sin-resultados">No se encontraron productos.</p>`;
        return;
    }

    productos.forEach((producto: Product): void => {
        const article = document.createElement("article");
        article.classList.add("card-producto");

        const categoria: string = producto.categorias[0]?.nombre ?? "";

        article.innerHTML = `
            <img src="/vite.svg" alt="${producto.nombre}" />
            <div class="card-body">
                <span class="card-badge">${categoria}</span>
                <h3>${producto.nombre}</h3>
                <p>${producto.descripcion}</p>
                <div class="card-footer">
                    <span class="card-precio">$${producto.precio.toLocaleString("es-AR")}</span>
                    <button
                        class="btn-agregar"
                        data-id="${producto.id}"
                        ${!producto.disponible ? "disabled" : ""}
                    >
                        ${producto.disponible ? "Agregar" : "Sin stock"}
                    </button>
                </div>
            </div>
        `;

        const btn = article.querySelector<HTMLButtonElement>(".btn-agregar");
        btn?.addEventListener("click", (): void => {
            agregarAlCarrito(producto);
        });

        contenedor.appendChild(article);
    });
};

// ── Renderizar categorías en el aside ──
const renderCategorias = (): void => {
    if (!listaCategorias) return;
    const categorias: ICategory[] = getCategories();

    const liTodos = document.createElement("li");
    const btnTodos = document.createElement("button");
    btnTodos.textContent = "Todos";
    btnTodos.classList.add("activo");
    btnTodos.addEventListener("click", (): void => {
        categoriaActiva = null;
        textoBusqueda = "";
        if (inputBusqueda) inputBusqueda.value = "";
        if (tituloCatalogo) tituloCatalogo.textContent = "Productos Destacados";
        marcarBotonActivo(btnTodos);
        aplicarFiltros();
    });
    liTodos.appendChild(btnTodos);
    listaCategorias.appendChild(liTodos);

    categorias.forEach((cat: ICategory): void => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.textContent = cat.nombre;

        btn.addEventListener("click", (): void => {
            categoriaActiva = cat.id;
            textoBusqueda = "";
            if (inputBusqueda) inputBusqueda.value = "";
            if (tituloCatalogo) tituloCatalogo.textContent = cat.nombre;
            marcarBotonActivo(btn);
            aplicarFiltros();
        });

        li.appendChild(btn);
        listaCategorias.appendChild(li);
    });
};

// ── Marca el botón de categoría activo ──
const marcarBotonActivo = (botonActivo: HTMLButtonElement): void => {
    const botones = document.querySelectorAll<HTMLButtonElement>("#listaCategorias button");
    botones.forEach((b: HTMLButtonElement): void => b.classList.remove("activo"));
    botonActivo.classList.add("activo");
};

// ── Aplica búsqueda + filtro de categoría ──
const aplicarFiltros = (): void => {
    // Lee siempre desde localStorage para ver cambios del admin
    let resultado: Product[] = getProductos();

    if (categoriaActiva !== null) {
        resultado = resultado.filter((p: Product) =>
            p.categorias.some((c: ICategory) => c.id === categoriaActiva)
        );
    }

    if (textoBusqueda.trim() !== "") {
        const texto: string = textoBusqueda.toLowerCase();
        resultado = resultado.filter((p: Product) =>
            p.nombre.toLowerCase().includes(texto)
        );
    }

    renderProductos(resultado);
};

// ── Evento búsqueda por click ──
btnBuscar?.addEventListener("click", (): void => {
    textoBusqueda = inputBusqueda?.value ?? "";
    categoriaActiva = null;
    if (tituloCatalogo) tituloCatalogo.textContent = `Resultados: "${textoBusqueda}"`;
    marcarBotonActivo(
        document.querySelector<HTMLButtonElement>("#listaCategorias button")!
    );
    aplicarFiltros();
});

// ── Evento búsqueda en tiempo real ──
inputBusqueda?.addEventListener("input", (): void => {
    textoBusqueda = inputBusqueda.value;
    aplicarFiltros();
});

// ── Inicialización ──
renderCategorias();
aplicarFiltros();
actualizarContador();
