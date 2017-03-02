import { LancheDetailPage } from './../lanche-detail/lanche-detail';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';


@Component({
  selector: 'page-cardapio',
  templateUrl: 'cardapio.html'
})
export class CardapioPage {
  estabelecimento: any;
  lanches: any[];
  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public fireService: FireService,
              public app: App
    ) {

    this.estabelecimento = this.navParams.data;
    console.log(this.navParams.data);
    this.fireService.getLanchesPorEstabelecimento(this.estabelecimento.$key)
      .subscribe(lanches => this.lanches = lanches);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CardapioPage');
  }

  goToLanche(lanche){
    this.app.getRootNav().push(LancheDetailPage, {lanche: lanche, key_estabelecimento: this.estabelecimento.$key});
  }
}
