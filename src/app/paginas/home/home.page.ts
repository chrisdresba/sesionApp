import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/servicios/auth-service/auth.service';
import { UsuarioService } from 'src/app/shared/servicios/usuario-service/usuario.service';
import { NavController } from '@ionic/angular';
import { LoadersService } from 'src/app/shared/servicios/loaders-service/loaders.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  constructor(private authService: AuthService,
    private usuarioService: UsuarioService,
    private loaders: LoadersService,
    private nav: NavController
  ) { }

  async ngOnInit() {
    await this.loaders.presentLoading();
    if (this.usuario) {
      await this.loaders.dismissLoading();
      return;
    }

    const currentUser = await this.authService.getCurrentUser();
   
    if (currentUser?.uid) {
      const usuario = await this.usuarioService.obtenerUsuarioPorId(currentUser.uid);
      this.usuarioService.usuario.set(usuario); 
      console.log('Usuario cargado:',usuario);
    } else {
      console.warn('No hay usuario autenticado.');
    }
    await this.loaders.dismissLoading();
  }

  validarUsuario(){
    this.nav.navigateForward('/validar-identidad');
  }

  get usuario() {
    return this.usuarioService.usuario();
  }

  salir(){
    this.authService.logout();
  }
}