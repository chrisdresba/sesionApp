import { Injectable } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {
  constructor(
    private barcodeScanner: BarcodeScanner,
    private toastController: ToastController
  ) {}

  async scanBarcode(): Promise<any> {
    const options: BarcodeScannerOptions = {
      preferFrontCamera: false,
      showFlipCameraButton: true,
      showTorchButton: true,
      torch: false,
      saveHistory: true, 
      prompt: 'Coloca el código en el área de escaneo',
      resultDisplayDuration: 500,
      formats: 'PDF417',
      orientation: 'portrait',
    };

    try {
      const data = await this.barcodeScanner.scan(options);
      console.log('Resultado del escaneo:', data);
      await this.presentToast('Escaneo exitoso: ' + data.text);
      return this.extraerDatos(data.text); 
    } catch (error) {
      console.error('Error en el escaneo:', error);
      await this.presentToast('Error al escanear: ' + error);
      return null;
    }
  }

  private extraerDatos(barcode: string): any {
    const datos = barcode.split('@');
    if (datos.length < 8) {
      console.error('La cadena no tiene suficientes datos');
      return null;
    }

    return {
      apellido: datos[1], 
      nombre: datos[2],
      dni: datos[4],
      fecha: datos[6],
    };
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}