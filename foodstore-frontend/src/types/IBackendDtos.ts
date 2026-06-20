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
