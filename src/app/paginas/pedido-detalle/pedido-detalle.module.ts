import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidoDetallePageRoutingModule } from './pedido-detalle-routing.module';

import { PedidoDetallePage } from './pedido-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PedidoDetallePageRoutingModule
  ],
  declarations: [PedidoDetallePage]
})
export class PedidoDetallePageModule {}
