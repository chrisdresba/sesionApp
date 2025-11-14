import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Pedido } from 'src/app/shared/clases/pedido/pedidos';
import { EntidadService } from 'src/app/shared/servicios/entidad-service/entidad-service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { LoadersService } from 'src/app/shared/servicios/loaders-service/loaders.service';
import { getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})
export class DetallePage implements OnInit {

  formPedido: FormGroup;
  fotoBase64: string | null = null;
  permissions: boolean = false;
  modoPresentacion: boolean = true;

  cameraOptions: CameraPreviewOptions = {
    position: 'rear',
    toBack: true,
    disableAudio: true
  };

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private entidadService: EntidadService,
    private nav: NavController,
    private loadersService: LoadersService
  ) {
    this.formPedido = this.fb.group({
      direccionDestino: ['', Validators.required],
      nombreReceptor: ['', Validators.required],
      dniReceptor: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      direccionRetiro: ['', Validators.required],
    });
  }

  async ngOnInit() {
  }

  async prenderCamara(){
    await this.loadersService.presentLoading();
    try {
      const permiso = await Camera.requestPermissions({ permissions: ['camera'] });
      if (permiso.camera === 'granted') {
        this.permissions = true;
        await new Promise(resolve => setTimeout(resolve, 300));
        const imgData = await CameraPreview.start(this.cameraOptions);
        this.modoPresentacion = false;
      } else {
        this.permissions = false;
        this.modoPresentacion = true;
      }
    } catch (err) {
      console.error('Error al solicitar permisos:', err);
      this.permissions = false;
      this.modoPresentacion = true;
    } finally {
      await this.loadersService.dismissLoading();
    }
  }

  async tomarFoto() {
    await this.loadersService.presentLoading();
    try {
      const options: CameraPreviewPictureOptions = {
        quality: 80,
      };
      const result = await CameraPreview.capture(options);
      this.fotoBase64 = `data:image/jpeg;base64,${result.value}`;

      const blob = this.base64ToBlob(this.fotoBase64);
      const path = `pedidos/${Date.now()}.jpg`;
      const storageRef = ref(this.entidadService['storage'], path);
      await uploadBytes(storageRef, blob);
      const fotoUrl = await getDownloadURL(storageRef);
      this.fotoBase64 = fotoUrl;
      await CameraPreview.stop();
      await this.loadersService.dismissLoading();
      this.modoPresentacion = true;
    } catch (error) {
      console.error('Error al tomar foto:', error);
     } finally {
      await this.loadersService.dismissLoading();
    }
  }

  base64ToBlob(base64Data: string) {
    const parts = base64Data.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  async guardarPedido() {
    await this.loadersService.presentLoading();
    try {
      if (this.formPedido.invalid) return;
      const usuarioActual = this.auth.currentUser;
      if (!usuarioActual) return;

      const pedido: Pedido = {
        uidUsuario: usuarioActual.uid,
        dniReceptor: this.formPedido.value.dniReceptor,
        nombreReceptor: this.formPedido.value.nombreReceptor,
        direccionDestino: this.formPedido.value.direccionDestino,
        direccionRetiro: this.formPedido.value.direccionRetiro,
        fechaCreacion: new Date(),
        estado: 'pendiente',
        transportistaAsignado: ''
      };

      await this.entidadService.crearPedido(pedido, this.fotoBase64 || undefined);
      this.nav.navigateBack('/home');
    } catch (error) {
      console.error('Error al tomar foto:', error);
     } finally {
      await this.loadersService.dismissLoading();
    }
  }

  ionViewWillLeave() {
    CameraPreview.stop();
  }
}
