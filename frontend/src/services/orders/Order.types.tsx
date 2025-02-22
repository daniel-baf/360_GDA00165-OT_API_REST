export interface OrderDetailTypes {
  id: number;
  cantidad: number;
  precio_venta: number;
  subtotal: number;
  producto_id: number;
  producto_nombre: string;
}

export interface OrderTypes {
  id: number;
  fecha_creacion: string;
  fecha_confirmacion: string;
  fecha_entrega: string;
  total: number;
  usuario_validador_id: number;
  usuario_id: number;
  direccion_entrega_id: number;
  estado_pedido_id: number;
  estado_nombre: string;
  details?: OrderDetailTypes[];
}
