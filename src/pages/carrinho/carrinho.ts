import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-carrinho',
  templateUrl: 'carrinho.html'
})
export class CarrinhoPage {
  carrinho: any[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService
    ) {
      this.carrinho = this.fireService.getCart();
      console.log(this.carrinho);
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarrinhoPage');
  }

}
