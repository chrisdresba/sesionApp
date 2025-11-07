export interface Pedido {
  id?: string;
  uidUsuario: string; 
  dniReceptor: string;
  nombreReceptor: string;
  direccionDestino: string;
  direccionRetiro: string;
  fotoUrl?: string;           
  fechaCreacion: Date;
}
