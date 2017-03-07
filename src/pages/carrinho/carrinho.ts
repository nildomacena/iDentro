import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-carrinho',
  templateUrl: 'carrinho.html'
})
export class CarrinhoPage {
  carrinho: any[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public alertCtrl: AlertController
    ) {
      this.carrinho = this.fireService.getCart();
      console.log(this.carrinho);
    }

  ionViewDidLoad() {
    console.log('carrinho.length: ', this.carrinho.length);
  }

  goBack(){
    this.navCtrl.pop();
  }

  removeItem(item, index){
    if(item.quantidade == 1){
      let alert = this.alertCtrl.create({
        title: 'Confirmar',
        subTitle: 'Deseja excluir do carrinho o item '+item.lanche.nome,
        buttons: [
          {
           text:  'Cancelar',
           role: 'cancel',
          },
          {
           text:  'Confirmar',
           handler: () => {
             this.carrinho = this.fireService.removeItem(item);
           }
          }
        ]
      });
      alert.present();
    }

    else{
      this.carrinho = this.fireService.diminuiItem(item);
    }
  }

  addItem(item){
    this.carrinho = this.fireService.addItem(item);
  }

  fecharPedido(){
    console.log('Fechar pedido')
  }
}
