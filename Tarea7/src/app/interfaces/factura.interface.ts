export interface Factura {
  id?: number;
  numeroFactura?: string;
  fecha: string;
  cedulaRuc: string;
  nombreCliente: string;
  direccion?: string;
  telefono?: string;
  descripcion?: string;
  subtotal: number;
  iva: number;
  total: number;
  estado: string;
}