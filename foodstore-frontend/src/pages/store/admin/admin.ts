import { getCategories } from "../../../data/data";
import type { Product } from "../../../types/product";
import type { ICategory } from "../../../types/category";
import { protegerRuta, cerrarSesion } from "../../../utils/auth";
import { getUSer, getProductos, saveProductos } from "../../../utils/localStorage";
import type { IUser } from "../../../types/IUser";

// Guard: solo admin puede acceder
protegerRuta("admin");

// ── Referencias al DOM ──
const tbodyProductos = document.querySelector<HTMLTableSectionElement>("#tbodyProductos");
const totalProductos = document.querySelector<HTMLSpanElement>("#totalProductos");
const seccionTabla = document.querySelector<HTMLElement>("#seccionTabla");
const seccionFormulario = document.querySelector<HTMLElement>("#seccionFormulario");
const seccionEdicion = document.querySelector<HTMLElement>("#seccionEdicion");
const btnVerProductos = document.querySelector<HTMLButtonElement>("#btnVerProductos");
const btnVerFormulario = document.querySelector<HTMLButtonElement>("#btnVerFormulario");
const formProducto = document.querySelector<HTMLFormElement>("#formProducto");
const formEdicion = document.querySelector<HTMLFormElement>("#formEdicion");
const selectCategoria = document.querySelector<HTMLSelectElement>("#selectCategoria");
const selectEditCategoria = document.querySelector<HTMLSelectElement>("#editCategoria");
const mensajeFormulario = document.querySelector<HTMLParagraphElement>("#mensajeFormulario");
const mensajeEdicion = document.querySelector<HTMLParagraphElement>("#mensajeEdicion");
const emailAdmin = document.querySelector<HTMLSpanElement>("#emailAdmin");
const btnCerrarSesion = document.querySelector<HTMLButtonElement>("#btnCerrarSesion");
const btnCancelarEdicion = document.querySelector<HTMLButtonElement>("#btnCancelarEdicion");

// Campos del formulario de edición
const editId = document.querySelector<HTMLInputElement>("#editId");
const editNombre = document.querySelector<HTMLInputElement>("#editNombre");
const editPrecio = document.querySelector<HTMLInputElement>("#editPrecio");
const editStock = document.querySelector<HTMLInputElement>("#editStock");
const editDescripcion = document.querySelector<HTMLTextAreaElement>("#editDescripcion");

// ── Muestra el email del admin logueado ──
const sesionRaw: string | null = getUSer();
if (sesionRaw && emailAdmin) {
    const sesion: IUser = JSON.parse(sesionRaw) as IUser;
    emailAdmin.textContent = sesion.email;
}

// ── Cerrar sesión ──
btnCerrarSesion?.addEventListener("click", (): void => {
    cerrarSesion();
});

// ── Helper: muestra solo una sección y actualiza botones activos ──
const mostrarSeccion = (seccion: "tabla" | "formulario" | "edicion"): void => {
    if (seccionTabla) seccionTabla.style.display = seccion === "tabla" ? "block" : "none";
    if (seccionFormulario) seccionFormulario.style.display = seccion === "formulario" ? "block" : "none";
    if (seccionEdicion) seccionEdicion.style.display = seccion === "edicion" ? "block" : "none";

    btnVerProductos?.classList.toggle("activo", seccion === "tabla");
    btnVerFormulario?.classList.toggle("activo", seccion === "formulario");
};

// ── Navegación entre secciones ──
btnVerProductos?.addEventListener("click", (): void => {
    mostrarSeccion("tabla");
    renderTabla();
});

btnVerFormulario?.addEventListener("click", (): void => {
    mostrarSeccion("formulario");
});

btnCancelarEdicion?.addEventListener("click", (): void => {
    mostrarSeccion("tabla");
    renderTabla();
});

// ── Cargar categorías en ambos selects ──
const cargarCategorias = (): void => {
    const categorias: ICategory[] = getCategories();

    categorias.forEach((cat: ICategory): void => {
        // Select del formulario de agregar
        const opt1 = document.createElement("option");
        opt1.value = cat.id.toString();
        opt1.textContent = cat.nombre;
        selectCategoria?.appendChild(opt1);

        // Select del formulario de editar
        const opt2 = document.createElement("option");
        opt2.value = cat.id.toString();
        opt2.textContent = cat.nombre;
        selectEditCategoria?.appendChild(opt2);
    });
};

// ── Eliminar producto ──
const eliminarProducto = (id: number): void => {
    const confirmado: boolean = confirm("¿Estás seguro de que querés eliminar este producto?");
    if (!confirmado) return;

    const productos: Product[] = getProductos();
    const actualizados: Product[] = productos.filter((p: Product) => p.id !== id);
    saveProductos(actualizados);
    renderTabla();
};

// ── Abrir formulario de edición pre-cargado ──
const abrirEdicion = (id: number): void => {
    const productos: Product[] = getProductos();
    const producto: Product | undefined = productos.find((p: Product) => p.id === id);

    if (!producto) return;

    // Pre-cargar los campos con los valores actuales
    if (editId) editId.value = producto.id.toString();
    if (editNombre) editNombre.value = producto.nombre;
    if (editPrecio) editPrecio.value = producto.precio.toString();
    if (editStock) editStock.value = producto.stock.toString();
    if (editDescripcion) editDescripcion.value = producto.descripcion;

    // Seleccionar la categoría actual en el select
    const categoriaActualId: number = producto.categorias[0]?.id ?? 0;
    if (selectEditCategoria) {
        selectEditCategoria.value = categoriaActualId.toString();
    }

    if (mensajeEdicion) mensajeEdicion.textContent = "";

    mostrarSeccion("edicion");
};

// ── Guardar cambios de edición ──
formEdicion?.addEventListener("submit", (event: Event): void => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const id: number = parseInt(editId?.value ?? "0");
    const nombre: string = formData.get("nombre") as string;
    const precio: number = parseFloat(formData.get("precio") as string);
    const stock: number = parseInt(formData.get("stock") as string);
    const categoriaId: number = parseInt(formData.get("categoria") as string);
    const descripcion: string = formData.get("descripcion") as string;

    const categorias: ICategory[] = getCategories();
    const categoriaSeleccionada: ICategory | undefined = categorias.find(
        (c: ICategory) => c.id === categoriaId
    );

    if (!categoriaSeleccionada) {
        if (mensajeEdicion) {
            mensajeEdicion.textContent = "Seleccioná una categoría válida.";
            mensajeEdicion.className = "mensaje-form error";
        }
        return;
    }

    const productos: Product[] = getProductos();

    // Busca el índice del producto a editar
    const indice: number = productos.findIndex((p: Product) => p.id === id);

    if (indice === -1) return;

    // Actualiza el producto manteniendo los campos que no se editan
    productos[indice] = {
        ...productos[indice],
        nombre: nombre,
        precio: precio,
        stock: stock,
        descripcion: descripcion,
        disponible: stock > 0,
        categorias: [categoriaSeleccionada]
    };

    saveProductos(productos);

    if (mensajeEdicion) {
        mensajeEdicion.textContent = `Producto "${nombre}" actualizado correctamente.`;
        mensajeEdicion.className = "mensaje-form exito";
    }

    setTimeout((): void => {
        if (mensajeEdicion) mensajeEdicion.textContent = "";
        mostrarSeccion("tabla");
        renderTabla();
    }, 1500);
});

// ── Renderizar la tabla ──
const renderTabla = (): void => {
    if (!tbodyProductos) return;

    const productos: Product[] = getProductos();
    tbodyProductos.innerHTML = "";

    if (totalProductos) {
        totalProductos.textContent = productos.length.toString();
    }

    productos.forEach((producto: Product): void => {
        const tr = document.createElement("tr");
        const categoria: string = producto.categorias[0]?.nombre ?? "—";

        tr.innerHTML = `
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${categoria}</td>
            <td>$${producto.precio.toLocaleString("es-AR")}</td>
            <td>${producto.stock}</td>
            <td>
                <span class="badge-disponible ${producto.disponible ? "si" : "no"}">
                    ${producto.disponible ? "Sí" : "No"}
                </span>
            </td>
            <td>
                <button class="btn-editar" data-id="${producto.id}">Editar</button>
                <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
            </td>
        `;

        tr.querySelector<HTMLButtonElement>(".btn-editar")
            ?.addEventListener("click", (): void => {
                abrirEdicion(producto.id);
            });

        tr.querySelector<HTMLButtonElement>(".btn-eliminar")
            ?.addEventListener("click", (): void => {
                eliminarProducto(producto.id);
            });

        tbodyProductos.appendChild(tr);
    });
};

// ── Agregar nuevo producto ──
formProducto?.addEventListener("submit", (event: Event): void => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const nombre: string = formData.get("nombre") as string;
    const precio: number = parseFloat(formData.get("precio") as string);
    const stock: number = parseInt(formData.get("stock") as string);
    const categoriaId: number = parseInt(formData.get("categoria") as string);
    const descripcion: string = formData.get("descripcion") as string;

    const categorias: ICategory[] = getCategories();
    const categoriaSeleccionada: ICategory | undefined = categorias.find(
        (c: ICategory) => c.id === categoriaId
    );

    if (!categoriaSeleccionada) {
        if (mensajeFormulario) {
            mensajeFormulario.textContent = "Seleccioná una categoría válida.";
            mensajeFormulario.className = "mensaje-form error";
        }
        return;
    }

    const productos: Product[] = getProductos();
    const nuevoId: number = Math.max(...productos.map((p: Product) => p.id)) + 1;

    const nuevoProducto: Product = {
        id: nuevoId,
        eliminado: false,
        createdAt: new Date().toISOString(),
        nombre: nombre,
        precio: precio,
        descripcion: descripcion,
        stock: stock,
        imagen: "pizza.jpg",
        disponible: stock > 0,
        categorias: [categoriaSeleccionada]
    };

    productos.push(nuevoProducto);
    saveProductos(productos);

    if (mensajeFormulario) {
        mensajeFormulario.textContent = `Producto "${nombre}" agregado correctamente.`;
        mensajeFormulario.className = "mensaje-form exito";
    }

    formProducto.reset();

    setTimeout((): void => {
        if (mensajeFormulario) mensajeFormulario.textContent = "";
        mostrarSeccion("tabla");
        renderTabla();
    }, 1500);
});

// ── Inicialización ──
cargarCategorias();
renderTabla();
