import { ChatPage } from './../chat/chat';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';


@Component({
  selector: 'page-cardapio-vazio',
  templateUrl: 'cardapio-vazio.html'
})
export class CardapioVazioPage {

  estabelecimento: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController
    ) {
    this.estabelecimento = this.navParams.data.estabelecimento;
    console.log('esta', this.estabelecimento);
  }

  ionViewDidLoad() {

  }
  goToChat(){
    console.log('chat');
    let modal = this.modalCtrl.create(ChatPage, {estabelecimento: this.estabelecimento});
    modal.present();

  }
}
