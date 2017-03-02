import { CardapioPage } from './../cardapio/cardapio';
import { BebidasPage } from './../bebidas/bebidas';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-estabelecimento',
  templateUrl: 'estabelecimento.html'
})
export class EstabelecimentoPage {
  estabelecimento: any;
  photo: string;
  bebidasPage = BebidasPage;
  cardapioPage = CardapioPage;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController
    ) {

    this.estabelecimento = this.navParams.get('estabelecimento');
    this.estabelecimento.imagemCapa? this.photo = this.estabelecimento.imagemCapa : this.photo = 'assets/no-photo.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EstabelecimentoPage');
  }

  call(){
    let buttons;
    let subTitle;
    
    this.estabelecimento.celular && this.estabelecimento.telefone? subTitle = 'Selecione o número para o qual deseja ligar.': 'Deseja realmente ligar?'

    if(this.estabelecimento.celular && this.estabelecimento.telefone){
      buttons = [
        {
          text: this.estabelecimento.telefone,
          handler: () => {console.log(this.estabelecimento.telefone)}
        },
        {
          text: this.estabelecimento.celular.numero,
          handler: () => {console.log(this.estabelecimento.celular.numero)}
        },
        {
          text: 'Cancelar',
          role: 'cancel'
        }
      ]
    }

    else if(this.estabelecimento.celular){
      buttons = [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ligar',
          handler: () => {console.log(this.estabelecimento.celular)}
        }
      ]
    }

    else if(this.estabelecimento.telefone){
      buttons = [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ligar',
          handler: () => {console.log(this.estabelecimento.celular.numero)}
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
