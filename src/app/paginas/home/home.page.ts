import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/servicios/auth-service/auth.service';
import { UsuarioService } from 'src/app/shared/servicios/usuario-service/usuario.service';
import { NavController, RefresherCustomEvent } from '@ionic/angular';
import { LoadersService } from 'src/app/shared/servicios/loaders-service/loaders.service';
import { Observable } from 'rxjs';
import { Pedido } from 'src/app/shared/clases/pedido/pedidos';
import { EntidadService } from 'src/app/shared/servicios/entidad-service/entidad-service';

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
    if (this.usuario) {
      await this.loaders.dismissLoading();
      return;
    }
    this.buscarDatos();
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
      const usuario = await this.usuarioService.obtenerUsuarioPorId(currentUser.uid);
      this.pedidos$ = this.entidadService.obtenerPedidosPorUsuario(currentUser.uid);
      this.usuarioService.usuario.set(usuario); 
      console.log('Usuario cargado:',usuario);
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

  get usuario() {
    return this.usuarioService.usuario();
  }

  salir(){
    this.authService.logout();
  }
}