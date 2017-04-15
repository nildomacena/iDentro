import { FechamentoPedidoPage } from './../fechamento-pedido/fechamento-pedido';
import { HomePage } from './../home/home';
import { LocalizacaoPage } from './../localizacao/localizacao';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, ActionSheetController, ViewController, Platform } from 'ionic-angular';


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
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionSheet: ActionSheetController,
    public viewCtrl: ViewController,
    public platform: Platform
    ) {
      this.carrinho = this.fireService.getCart();
      
    }

  ionViewDidLoad() {
    
  }

  goBack(){
    this.navCtrl.pop();
  }

  removeItem(entrada){
    console.log(entrada);
    if(entrada.quantidade == 1){
      let alert = this.alertCtrl.create({
        title: 'Confirmar',
        subTitle: 'Deseja excluir do carrinho o item '+entrada.item.nome,
        buttons: [
          {
           text:  'Cancelar',
           role: 'cancel',
          },
          {
           text:  'Confirmar',
           handler: () => {
             this.carrinho = this.fireService.removeItem(entrada);
           }
          }
        ]
      });
      alert.present();
    }

    else{
      this.carrinho = this.fireService.diminuiItem(entrada);
    }
  }

  addItem(entrada){
    this.carrinho = this.fireService.addItem(entrada);
  }

  fecharPedido(){
    this.navCtrl.push(FechamentoPedidoPage);
  }

  definirLocalizacao(){
    let modal = this.modalCtrl.create(LocalizacaoPage, {modal: true});
    modal.present();
    modal.onDidDismiss(_ => {
      console.log('Modal fechado.');
    })
  }

  openSettings(){
    let action = this.actionSheet.create({
      title: 'Carrinho',
      buttons: [
        {
         text: 'Limpar carrinho',
         role: 'destructive',
         icon: 'trash',
         handler: () => {
           this.carrinho = this.fireService.limpaCarrinho();
         }
        }
      ]
    })
    action.present();
  }

  backButtonAction(){
    this.navCtrl.setRoot(HomePage);
  }
}
