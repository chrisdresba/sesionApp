import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/servicios/auth-service/auth.service';
import { UsuarioService } from 'src/app/shared/servicios/usuario-service/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  usuario:any;

  constructor(private authService: AuthService,private usuarioService: UsuarioService) { }

  ngOnInit() {
    //this.usuarioService.obtenerUsuario().subscribe(usuario => {
    //  this.usuario = usuario;
    //  console.log('Usuario:', usuario);
    //});
  }

  salir(){
    this.authService.logout();
  }
}
