import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/servicios/auth-service/auth.service';
import { UsuarioService } from 'src/app/shared/servicios/usuario-service/usuario.service';
import { NavController, RefresherCustomEvent } from '@ionic/angular';
import { LoadersService } from 'src/app/shared/servicios/loaders-service/loaders.service';
import { Observable } from 'rxjs';
import { Pedido } from 'src/app/shared/clases/pedido/pedidos';
import { EntidadService } from 'src/app/shared/servicios/entidad-service/entidad-service';
import { Usuario } from 'src/app/shared/clases/usuario/usuario';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  pedidos$: Observable<Pedido[]> | undefined;

  constructor(private authService: AuthService,
    private usuarioService: UsuarioService,
    private loaders: LoadersService,
    private entidadService: EntidadService,
    private nav: NavController
  ) { }

  async ngOnInit() {
    await this.loaders.presentLoading();
    await this.buscarDatos();
    await this.loaders.dismissLoading();
  }

  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.buscarDatos();
      event.target.complete();
    }, 2000);
  }

  async buscarDatos(){
    const currentUser = await this.authService.getCurrentUser();
   
    if (currentUser?.uid) {
      const user = await this.usuarioService.obtenerUsuarioPorId(currentUser.uid);
      this.usuarioService.usuario.set(user);
      if(this.usuario?.perfil === 'transportista'){
        this.pedidos$ = this.entidadService.obtenerPedidosPendientes();
      } else {
        this.pedidos$ = this.entidadService.obtenerPedidosPorUsuario(currentUser.uid);
      }
      console.log('Usuario cargado:',this.usuario);
    } else {
      console.warn('No hay usuario autenticado.');
    }
  }

  validarUsuario(){
    this.nav.navigateForward('/validar-identidad');
  }

  crearItem(){
     this.nav.navigateForward('/detalle');
  }

  verDetalle(pedido: Pedido){
    this.nav.navigateForward(`/pedido-detalle/${pedido.id}`);
  }

  get usuario() {
    return this.usuarioService.usuario();
  }

  salir(){
    this.authService.logout();
  }
}