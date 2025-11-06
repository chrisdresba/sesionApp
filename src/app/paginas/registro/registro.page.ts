import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/servicios/auth-service/auth.service';
import { UsuarioService } from 'src/app/shared/servicios/usuario-service/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false
})
export class RegistroPage implements OnInit {

  registerForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private nav: NavController,
    private usuarioService:UsuarioService) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  register() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      
      this.authService.register(email, password)
      .then((credential) => {
        console.log(credential)
        const uid = credential.user?.uid; 
        if (uid) {
          this.usuarioService.registrarUsuario(email, uid); 
          this.nav.navigateForward('/login');
        }
      })
      .catch(error => {
        console.log('Error en registro:',error);
      });
    }
  }

  navegarLogin(){
    this.nav.navigateForward('/login');
  }
}

