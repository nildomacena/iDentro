import { LocalizacaoPage } from './../localizacao/localizacao';
import { HomePage } from './../home/home';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Card, AlertController, ToastController, ModalController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-fechamento-pedido',
  templateUrl: 'fechamento-pedido.html'
})
export class FechamentoPedidoPage {
  enderecos: any[];
  enderecoSelecionado: any;
  carrinho: any;
  enderecoAdicional: any;
  observacao: string = ''
  dinheiro: boolean = false;
  cartao: boolean = false;
  troco:string = '';
  bandeiraCartao: string = '';
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

  }
  onSelectEndereco(endereco){
    this.enderecoSelecionado = endereco;
  }
  onSelectDinheiro(){
    this.dinheiro = true;
    this.cartao = false;
  }
  onSelectCartao(){
    this.dinheiro = false;
    this.cartao = true;

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
            this.fireService.fecharPedido(this.observacao, this.enderecoSelecionado,this.dinheiro,this.cartao,+this.troco,this.bandeiraCartao)
              .then(_ => {
                  let toast = this.toastCtrl.create({
                    message: 'Pedido realizado. Aguarde alguns minutos.',
                    duration: 2500
                  });
                  toast.present();
                  this.fireService.limpaCarrinho();
              })
              .catch(err => {
                console.log(err);
                // Import the AlertController from ionic package 
                // Consume it in the constructor as 'alertCtrl' 
                let alert = this.alertCtrl.create({
                  title: 'Erro',
                  message: 'Ocorreu um erro ao gerar seu pedido. Confirme se ele foi realizado no meu Pedidos, caso contrário tente realizar o pedido novamente',
                  buttons: [
                    {
                    text: 'Cancel', role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                    }, {
                      text: 'Ok',
                      handler: () => {
                      console.log('Ok clicked');
                    }
                    }
                  ]
                });
                alert.present();
              })
          }
        }
      ]
    });
    alert.present()
  }

  addEndereco(){
    let modal = this.modalCtrl.create('LocalizacaoPage', {adicional: true});
    modal.present();
    modal.onDidDismiss(data => {
      console.log('data dismiss modal', data);
      if(data){
      this.enderecoAdicional = data.endereco;
      this.onSelectEndereco(this.enderecoAdicional);
      }
    })
  }
}
