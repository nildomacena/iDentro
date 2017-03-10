import { CallNumber } from 'ionic-native';
import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-lanche-detail',
  templateUrl: 'lanche-detail.html'
})
export class LancheDetailPage {
  lanche: any;
  justAddedToCart: boolean = false;
  estabelecimento: any;
  pesquisa: boolean; //Variável testa se a página anterior foi a página de pesquisa
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public fireService: FireService
    ) {
      let key_lanche = this.navParams.get('lanche').$key;
      this.pesquisa = this.navParams.get('pesquisa');
      this.estabelecimento = this.navParams.get('estabelecimento');
      this.fireService.getLancheByKey(key_lanche)
        .subscribe(lanche => {
          this.lanche = lanche;
          console.log(this.lanche);
        })

        if(!this.estabelecimento){
          this.fireService.getEstabelecimentoByKey(this.lanche.key_estabelecimento)
            .subscribe(estabelecimento => {
              this.estabelecimento = estabelecimento;
            })
        }
      
    }

  ionViewDidLoad() {
    console.log(this.estabelecimento);
  }

  goBack(){
    this.navCtrl.pop();
  }
  goToEstabelecimento(){
    this.navCtrl.push(EstabelecimentoPage, {estabelecimento: this.estabelecimento});
  }

  addToCart(){
    this.justAddedToCart = true;
    this.fireService.addToCart(this.lanche, this.estabelecimento);
    let toast = this.toastCtrl.create({
      message: this.lanche.nome+' adicionado ao carrinho',
      duration: 2500,
      showCloseButton: true,
      closeButtonText: 'x',
      dismissOnPageChange: true
    })
    setTimeout(() => {
      this.justAddedToCart = false;
    }, 2500)
    toast.present();
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
          handler: () => {CallNumber.callNumber(this.estabelecimento.celular, false)}
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
