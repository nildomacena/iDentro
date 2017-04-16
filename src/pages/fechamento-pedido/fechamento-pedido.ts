import { LocalizacaoPage } from './../localizacao/localizacao';
import { HomePage } from './../home/home';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Card, AlertController, ToastController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-fechamento-pedido',
  templateUrl: 'fechamento-pedido.html'
})
export class FechamentoPedidoPage {
  enderecos: any[];
  enderecoSelecionado: any;
  carrinho: any;
  enderecoAdicional: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fireService: FireService,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController

    ) {
      this.carrinho = this.fireService.getCart();
      this.fireService.getEnderecos()
        .subscribe(enderecos => {
          this.enderecos = enderecos;
        });
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FechamentoPedidoPage');
  }
  onSelectEndereco(endereco){
    this.enderecoSelecionado = endereco;
  }

  fecharPedido(){
    let alert = this.alertCtrl.create({
      title: 'Confirme',
      subTitle: `Tem certeza que deseja confirmar o pedido no valor de R$${this.carrinho.valor} no estabelecimento ${this.carrinho.estabelecimento.nome}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.navCtrl.setRoot(HomePage);
            this.fireService.limpaCarrinho();
            let toast = this.toastCtrl.create({
              message: 'Pedido realizado. Aguarde alguns minutos.',
              duration: 2500
            });
            toast.present();
          }
        }
      ]
    });
    alert.present()
  }

  addEndereco(){
    let modal = this.modalCtrl.create(LocalizacaoPage, {adicional: true});
    modal.present();
    modal.onDidDismiss(data => {
      this.enderecoAdicional = data.endereco;
      this.onSelectEndereco(this.enderecoAdicional);
    })
  }
}
