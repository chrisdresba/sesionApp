import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/servicios/auth-service/auth.service';
import { UsuarioService } from 'src/app/shared/servicios/usuario-service/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private nav: NavController,
    private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async login() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
       const userCredential = await this.authService.login(email,password)
      if(userCredential) {
        const usuario= await this.usuarioService.obtenerUsuarioPorId(userCredential.user.uid);
        this.usuarioService.usuario.set(usuario);
        await this.nav.navigateForward('/home');
      } else {
        console.log('Error en login:');
      }
    }
  }

  navegar(){
    this.nav.navigateForward('/registro');
  }

}
