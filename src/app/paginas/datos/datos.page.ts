import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UsuarioService } from 'src/app/shared/servicios/usuario-service/usuario.service';
import { Direccion } from 'src/app/shared/clases/direccion/direccion';
import { BarcodeService } from 'src/app/shared/servicios/barcode-service/barcode-service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.page.html',
  styleUrls: ['./datos.page.scss'],
  standalone: false
})
export class DatosPage {
  formDatos: FormGroup;
  datosDni: any = null;
  mostrandoScanner = false;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private usuarioService: UsuarioService,
    private barcodeService: BarcodeService,
    private nav: NavController
  ) {
    this.formDatos = this.fb.group({
      nombre: [{ value: '', disabled: true }],
      apellido: [{ value: '', disabled: true }],
      dni: [{ value: '', disabled: true }],
      fecha: [{ value: '', disabled: true }],
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      localidad: ['', Validators.required],
      provincia: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Datos de prueba
    this.setMock();
  }

  setMock(){
    this.datosDni = { dni: 30444555, nombre: 'Alan', apellido: 'Peralta', fecha: '01/01/1990' };
    this.formDatos.patchValue({
      nombre: this.datosDni.nombre,
      apellido: this.datosDni.apellido,
      dni: this.datosDni.dni,
      fecha: this.datosDni.fecha,
    });
  }

  async escanearDni() {
    try {
      this.mostrandoScanner = true;
      document.body.style.background = 'transparent';
      document.querySelector('ion-app')?.classList.add('scanner-active');

      const resultado = await this.barcodeService.scanBarcode();

      this.mostrandoScanner = false;
      document.querySelector('ion-app')?.classList.remove('scanner-active');
      document.body.style.background = '';

      if (!resultado) return;
      const datos = this.usuarioService.extraerDatos(resultado);
      if (datos) {
        this.datosDni = datos;
        this.formDatos.patchValue({
          nombre: datos.nombre,
          apellido: datos.apellido,
          dni: datos.dni,
          fecha: datos.fecha,
        });
      }
    } catch (error) {
      console.error('Error al escanear DNI:', error);
      this.mostrandoScanner = false;
      document.querySelector('ion-app')?.classList.remove('scanner-active');
      document.body.style.background = '';
    }
  }

  async guardarDatos() {
    if (this.formDatos.invalid || !this.datosDni) return;

    const usuarioActual = this.auth.currentUser;
    if (!usuarioActual) return;

    try {
      const { dni, nombre, apellido, fecha } = this.datosDni;
      const direccion: Direccion = this.formDatos.getRawValue();

      await this.usuarioService.validarUsuario(
        usuarioActual.uid,
        dni,
        nombre,
        apellido,
        fecha,
        direccion
      );
      this.nav.navigateForward('/home');
    } catch (error) {
      console.error('Error al guardar datos del usuario:', error);
    }
  }
}