import { LancheDetailPage } from './../lanche-detail/lanche-detail';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, App, AlertController } from 'ionic-angular';


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
              public alertCtrl: AlertController,
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
    this.app.getRootNav().push(LancheDetailPage, {lanche: lanche, estabelecimento: this.estabelecimento});
  }

  addToCart(lanche){
    if(this.fireService.addToCart(lanche, this.estabelecimento) == 'error'){
      let alert = this.alertCtrl.create({
        title: 'Alerta',
        subTitle: 'Você tem itens de outro estabelecimento adicionados ao carrinho. Deseja limpar o carrinho para adiconar este novo item?',
        buttons: [
          {
            text: 'Não',
            role: 'cancel'
          },
          {
            text: 'Sim',
            handler: () => {
              this.fireService.limpaCarrinho();
              this.fireService.addToCart(lanche, this.estabelecimento);
            }
          }
        ]
      })
      alert.present();

    }
  }
}
