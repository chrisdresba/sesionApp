import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadersService {

  loaderActive: boolean = false;

  constructor(
    public loadingController: LoadingController,
  ) { }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'lines',
      translucent: true,
      cssClass: 'custom-class custom-loading'
    });
    this.loaderActive = true;
    return await loading.present();
  }


  async dismissLoading() {
    this.loaderActive = false;
    return await this.loadingController.dismiss();
  }

}
