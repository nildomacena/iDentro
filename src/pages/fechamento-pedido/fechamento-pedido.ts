import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-fechamento-pedido',
  templateUrl: 'fechamento-pedido.html'
})
export class FechamentoPedidoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad FechamentoPedidoPage');
  }

}
