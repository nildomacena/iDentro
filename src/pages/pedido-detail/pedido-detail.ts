import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-pedido-detail',
  templateUrl: 'pedido-detail.html',
})
export class PedidoDetail {

  pedido: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pedido = this.navParams.get('pedido');
    console.log(this.pedido);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidoDetail');
  }

}
