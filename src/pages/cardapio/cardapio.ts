import { CallNumber } from '@ionic-native/call-number';
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
  isLoadingCardapio: boolean = true;
  logado: boolean = false;
  constructor(
              public navCtrl: NavController, 
              public navParams: NavParams,
              public fireService: FireService,
              public alertCtrl: AlertController,
              public callnumber: CallNumber,
              public app: App
    ) {

    this.estabelecimento = this.navParams.data;
    console.log(this.navParams.data);
    this.fireService.getLanchesPorEstabelecimento(this.estabelecimento.$key)
      .subscribe(lanches => {
        this.isLoadingCardapio = false;
        this.lanches = lanches
      });
  }

  ionViewDidLoad() {
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

  call(){
    let buttons;
    let subTitle;
    
    this.estabelecimento.telefone2 && this.estabelecimento.telefone1? subTitle = 'Selecione o número para o qual deseja ligar.': 'Deseja realmente ligar?'

    if(this.estabelecimento.telefone2 && this.estabelecimento.telefone1){
      buttons = [
        {
          text: this.estabelecimento.telefone1.numero,
          handler: () => {console.log(this.estabelecimento.telefone1)}
        },
        {
          text: this.estabelecimento.telefone2.numero,
          handler: () => {console.log(this.estabelecimento.telefone2.numero)}
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }

    else if(this.estabelecimento.telefone2){
      buttons = [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ligar',
          handler: () => {this.callnumber.callNumber(this.estabelecimento.telefone2.numero, false)}
        }
      ]
    }

    else if(this.estabelecimento.telefone1){
      buttons = [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ligar',
          handler: () => {console.log(this.estabelecimento.telefone2.numero)}
        }
      ]
    }

    let alert = this.alertCtrl.create({
      title: 'Ligar para '+this.estabelecimento.nome,
      subTitle: subTitle,
      buttons: buttons
    });
    alert.present();
  }
}
