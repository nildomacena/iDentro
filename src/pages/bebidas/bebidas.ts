import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-bebidas',
  templateUrl: 'bebidas.html'
})
export class BebidasPage {
  estabelecimento: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.estabelecimento = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BebidasPage');
  }

}
