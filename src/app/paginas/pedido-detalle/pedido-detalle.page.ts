import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pedido } from 'src/app/shared/clases/pedido/pedidos';
import { Usuario } from 'src/app/shared/clases/usuario/usuario';
import { EntidadService } from 'src/app/shared/servicios/entidad-service/entidad-service';
import { LoadersService } from 'src/app/shared/servicios/loaders-service/loaders.service';
import { UsuarioService } from 'src/app/shared/servicios/usuario-service/usuario.service';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.page.html',
  styleUrls: ['./pedido-detalle.page.scss'],
  standalone: false
})
export class PedidoDetallePage implements OnInit {

  pedidoId!: string;
  pedido?: Pedido;
  usuario?: Usuario;

  estados = [
    'Aceptado',
    'En camino',
    'Próxima entrega',
    'Entregado'
  ];

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private entidadService: EntidadService,
    private loaders: LoadersService
  ) {}

  ngOnInit() {
    this.pedidoId = this.route.snapshot.paramMap.get('id')!;
    this.usuario = this.usuarioService.usuario();
    this.cargarPedido();
  }

  cargarPedido() {
    this.entidadService.obtenerPedidoPorId(this.pedidoId).subscribe((pedido) => {
      this.pedido = pedido;
    });
  }

  async cambiarEstado(event: any) {
    const nuevoEstado = event.detail.value;

    await this.loaders.presentLoading();

    this.entidadService.actualizarEstadoPedido(this.pedidoId, nuevoEstado)
      .then(() => {
        this.pedido!.estado = nuevoEstado;
      })
      .finally(() => this.loaders.dismissLoading());
  }
}
