export interface Product3D {
  id: string;
  title: string;
  seller: string;
  price: number;
  imageUrl: string;
  modelUrl?: string; // <-- Propiedad opcional para el archivo 3D interactivo
}