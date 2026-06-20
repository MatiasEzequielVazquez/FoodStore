export interface IProductoDto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  stock: number;
  imagen: string;
  disponible: boolean;
  categoria: ICategoriaDto;
}

export interface ICategoriaDto {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface IDetallePedidoDto {
  id: number;
  cantidad: number;
  subtotal: number;
  producto: IProductoDto;
}

export interface IPedidoDto {
  id: number;
  fecha: string;
  estado: string;
  total: number;
  formaPago: string;
  idUsuario: number;
  detalles: IDetallePedidoDto[];
}
