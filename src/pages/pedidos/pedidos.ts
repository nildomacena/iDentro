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
    setTimeout(() => {
        this.fireService.getPedidosPorUid()
          .subscribe(pedidos => {
            let aux_pedidos = pedidos;
            this.ordenarPedidos(aux_pedidos);
            this.pedidos = aux_pedidos.sort((a, b) => {
              console.log(a,b);
              return a.timestamp < b.timestamp? 1: a.timestamp > b.timestamp? -1 : 0
            })
            this.isLoading = false;
            console.log(this.pedidos);
          })
    }, 500);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Pedidos');
  }

  ordenarPedidos(pedidos){

  }

  goBack(){
    this.navCtrl.pop();
  }
}
