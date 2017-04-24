import { FechamentoPedidoPage } from './fechamento-pedido'
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    FechamentoPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(FechamentoPedidoPage),
  ],
  exports: [
    FechamentoPedidoPage
  ]
})
export class FechamentoPedidoPageModule {}
