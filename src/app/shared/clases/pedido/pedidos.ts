export interface Pedido {
  id?: string;
  uidUsuario: string; 
  dniReceptor: string;
  nombreReceptor: string;
  direccionDestino: string;
  direccionRetiro: string;
  transportistaAsignado?: string;
  fotoUrl?: string;
  estado?: string;          
  fechaCreacion: Date;
}
