// barcode.service.ts
import { Injectable } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerOptions,
  CapacitorBarcodeScannerScanResult,
  CapacitorBarcodeScannerTypeHint,
  CapacitorBarcodeScannerCameraDirection
} from '@capacitor/barcode-scanner';

@Injectable({
  providedIn: 'root'
})
export class BarcodeService {

  constructor(
    private toastController: ToastController,
    private platform: Platform
  ) {}

  private async prepare(): Promise<boolean> {
    await this.platform.ready();
    return true;
  }

  async scanBarcode(): Promise<string | null> {
    const ok = await this.prepare();
    if (!ok) return null;

    try {
      const options: CapacitorBarcodeScannerOptions = {
        hint: CapacitorBarcodeScannerTypeHint.PDF_417,
        cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK
      };

      const result: CapacitorBarcodeScannerScanResult = await CapacitorBarcodeScanner.scanBarcode(options);

      if (result && (result as any).ScanResult) {
        return (result as any).ScanResult;
      } else {
        await this.showToast('No se detectó ningún código.');
        return null;
      }
    } catch (error) {
      console.error('Error al escanear:', error);
      await this.showToast('Error durante el escaneo.');
      return null;
    }
  }

  private async showToast(msg: string) {
    const t = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom'
    });
    await t.present();
  }
}
