import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PedidoDetail } from './pedido-detail';

@NgModule({
  declarations: [
    PedidoDetail,
  ],
  imports: [
    IonicPageModule.forChild(PedidoDetail),
  ],
  exports: [
    PedidoDetail
  ]
})
export class PedidoDetailModule {}
