
import { protegerRuta, cerrarSesion } from "../../../utils/auth";
import { getUSer } from "../../../utils/localStorage";
import type { IUser } from "../../../types/IUser";
import { deleteProduct, getProducts, getCategories, getProductById, createProduct, updateProduct} from "../../../utils/api";
import type { ICategoriaDto, IProductoDto } from "../../../types/IBackendDtos";

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
const editImagen = document.querySelector<HTMLInputElement>("#editImagen");
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
btnVerProductos?.addEventListener("click", async (): Promise<void> => {
    mostrarSeccion("tabla");
    await renderTabla();
});

btnVerFormulario?.addEventListener("click", (): void => {
    mostrarSeccion("formulario");
});

btnCancelarEdicion?.addEventListener("click", async (): Promise<void> => {
    mostrarSeccion("tabla");
    await renderTabla();
});

// ── Cargar categorías en ambos selects ──
const cargarCategorias = async (): Promise<void> => {
    const categorias: ICategoriaDto[] = await getCategories();

    categorias.forEach((cat: ICategoriaDto): void => {
        const opt1 = document.createElement("option");
        opt1.value = cat.id.toString();
        opt1.textContent = cat.nombre;
        selectCategoria?.appendChild(opt1);

        const opt2 = document.createElement("option");
        opt2.value = cat.id.toString();
        opt2.textContent = cat.nombre;
        selectEditCategoria?.appendChild(opt2);
    });
};

// ── Eliminar producto ──
const eliminarProducto = async (id: number): Promise<void> => {
    const confirmado: boolean = confirm("¿Estás seguro de que querés eliminar este producto?");
    if (!confirmado) return;

    try {
        await deleteProduct(id);
        await renderTabla();
    } catch (error) {
        alert("No se pudo eliminar el producto.");
    }
};

// ── Abrir formulario de edición pre-cargado ──
const abrirEdicion = async (id: number): Promise<void> => {
    const producto: IProductoDto = await getProductById(id);

    if (editId) editId.value = producto.id.toString();
    if (editNombre) editNombre.value = producto.nombre;
    if (editPrecio) editPrecio.value = producto.precio.toString();
    if (editStock) editStock.value = producto.stock.toString();
    if (editImagen) editImagen.value = producto.imagen;
    if (editDescripcion) editDescripcion.value = producto.descripcion;

    const categoriaActualId: number = producto.categoria?.id ?? 0;
    if (selectEditCategoria) {
        selectEditCategoria.value = categoriaActualId.toString();
    }

    if (mensajeEdicion) mensajeEdicion.textContent = "";

    mostrarSeccion("edicion");
};

// ── Guardar cambios de edición ──
formEdicion?.addEventListener("submit", async (event: Event): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const id: number = parseInt(editId?.value ?? "0");
    const nombre: string = formData.get("nombre") as string;
    const precio: number = parseFloat(formData.get("precio") as string);
    const stock: number = parseInt(formData.get("stock") as string);
    const imagen: string = formData.get("imagen") as string;
    const idCategoria: number = parseInt(formData.get("categoria") as string);
    const descripcion: string = formData.get("descripcion") as string;

    try {
        await updateProduct(id, {
            nombre,
            descripcion,
            precio,
            stock,
            imagen: imagen,
            disponible: stock > 0,
            idCategoria,
        });

        if (mensajeEdicion) {
            mensajeEdicion.textContent = `Producto "${nombre}" actualizado correctamente.`;
            mensajeEdicion.className = "mensaje-form exito";
        }

        setTimeout(async (): Promise<void> => {
            if (mensajeEdicion) mensajeEdicion.textContent = "";
            mostrarSeccion("tabla");
            await renderTabla();
        }, 1500);
    } catch (error) {
        if (mensajeEdicion) {
            mensajeEdicion.textContent = "No se pudo actualizar el producto.";
            mensajeEdicion.className = "mensaje-form error";
        }
    }
});

// ── Renderizar la tabla ──
const renderTabla = async (): Promise<void> => {
    if (!tbodyProductos) return;

    const productos: IProductoDto[] = await getProducts();
    tbodyProductos.innerHTML = "";

    if (totalProductos) {
        totalProductos.textContent = productos.length.toString();
    }

    productos.forEach((producto: IProductoDto): void => {
        const tr = document.createElement("tr");
        const categoria: string = producto.categoria?.nombre ?? "—";

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
formProducto?.addEventListener("submit", async (event: Event): Promise<void> => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const nombre: string = formData.get("nombre") as string;
    const precio: number = parseFloat(formData.get("precio") as string);
    const stock: number = parseInt(formData.get("stock") as string);
    const imagen: string = formData.get("imagen") as string;
    const idCategoria: number = parseInt(formData.get("categoria") as string);
    const descripcion: string = formData.get("descripcion") as string;

    try {
        await createProduct({
            nombre,
            descripcion,
            precio,
            stock,
            imagen: imagen,
            disponible: stock > 0,
            idCategoria,
        });

        if (mensajeFormulario) {
            mensajeFormulario.textContent = `Producto "${nombre}" agregado correctamente.`;
            mensajeFormulario.className = "mensaje-form exito";
        }

        formProducto.reset();

        setTimeout(async (): Promise<void> => {
            if (mensajeFormulario) mensajeFormulario.textContent = "";
            mostrarSeccion("tabla");
            await renderTabla();
        }, 1500);
    } catch (error) {
        if (mensajeFormulario) {
            mensajeFormulario.textContent = "No se pudo agregar el producto.";
            mensajeFormulario.className = "mensaje-form error";
        }
    }
});

// ── Inicialización ──
const init = async (): Promise<void> => {
    await cargarCategorias();
    await renderTabla();
};

init();