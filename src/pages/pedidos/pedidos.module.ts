import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Pedidos } from './pedidos';

@NgModule({
  declarations: [
    Pedidos,
  ],
  imports: [
    IonicPageModule.forChild(Pedidos),
  ],
  exports: [
    Pedidos
  ]
})
export class PedidosModule {}
