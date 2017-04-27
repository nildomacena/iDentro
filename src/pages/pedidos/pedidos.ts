import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-pedidos',
  templateUrl: 'pedidos.html',
})
export class Pedidos {
  pedidos = [];
  isLoading = true;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService
    ) {
    this.fireService.getPedidosPorUid()
      .subscribe(pedidos => {
        this.pedidos = pedidos;
        this.isLoading = false;
        console.log(this.pedidos);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Pedidos');
  }

}
