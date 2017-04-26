import { CallNumber } from '@ionic-native/call-number';
import { FireService } from './../../services/fire.service';
import { Tab3Page } from './../tab3/tab3';
import { Tab2Page } from './../tab2/tab2';
import { Tab1Page } from './../tab1/tab1';
import { CardapioPage } from './../cardapio/cardapio';
import { BebidasPage } from './../bebidas/bebidas';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ViewController, IonicPage, Events } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-estabelecimento',
  templateUrl: 'estabelecimento.html'
})
export class EstabelecimentoPage {
  estabelecimento: any;
  photo: string;
  bebidasPage = BebidasPage;
  cardapioPage = CardapioPage;
  favorito: boolean;
  adicionando: boolean = false;
  logado: boolean = false;
  abas: any[] = [];
  tabs: any[] = [];
  tabParams: any;
  qtdeCarrinho: number = 0;
  cardapioVazio: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fireService: FireService,
    public platform: Platform,
    public viewCtrl: ViewController,
    public callnumber: CallNumber,
    public events: Events
    ) {
    this.tabParams = {
      estabelecimento: '',
      abas_key: []
    }

    this.qtdeCarrinho = this.fireService.getQuantidadeItensCarrinho();
    this.events.subscribe('quantidade:carrinho', qtde => {
      console.log('quantidade:carrinho: ', qtde);
      this.qtdeCarrinho = qtde;
    });
    this.estabelecimento = this.navParams.get('estabelecimento');
    this.tabParams.estabelecimento = this.estabelecimento;

    this.abas = this.estabelecimento.abas;
    try{
      Object.keys(this.abas).map((aba, index) => {
        if(index == 0){
          this.tabParams.abas_key[0] = aba;
          this.tabs.push({titulo: this.abas[aba].nome, root: Tab1Page})
        }
        else if(index == 1){
          this.tabParams.abas_key[1] = aba;
          this.tabs.push({titulo: this.abas[aba].nome, root: Tab2Page})
        }
        else if(index == 2){
          this.tabParams.abas_key[2] = aba;
          this.tabs.push({titulo: this.abas[aba].nome, root: Tab3Page})
        }
      });
      console.log(this.tabParams);
    }
    catch(err){
      this.cardapioVazio = true;
      console.log(err);
    }
    

    this.estabelecimento.imagemCapa? this.photo = this.estabelecimento.imagemCapa : this.photo = 'assets/no-photo.png';
      if(this.fireService.user)
        this.logado = true;
      else{
        this.logado = false;
      }
  }

  ionViewDidLoad() {
    this.logado = this.fireService.checkAuth();
    console.log(this.abas);
    this.fireService.checkFavorito(this.estabelecimento.$key)
      .then(result => {
        console.log('result load: ',result);
        this.favorito = result;
      })
  }

  call(){
    let buttons;
    let subTitle;
    
    this.estabelecimento.telefone2 && this.estabelecimento.telefone1? subTitle = 'Selecione o número para o qual deseja ligar.': 'Deseja realmente ligar?'

    if(this.estabelecimento.telefone2 && this.estabelecimento.telefone1){
      buttons = [
        {
          text: this.estabelecimento.telefone1,
          handler: () => {this.callnumber.callNumber(this.estabelecimento.telefone1.numero, true)}
        },
        {
          text: this.estabelecimento.telefone2.numero,
          handler: () => {this.callnumber.callNumber(this.estabelecimento.telefone2.numero, true)}
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
          handler: () => {this.callnumber.callNumber(this.estabelecimento.telefone2.numero, true)}
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

  addToFavorito(){
    this.adicionando = true;
    this.fireService.addToFavorito(this.estabelecimento, this.favorito)
      .then(_ => {
        this.fireService.checkFavorito(this.estabelecimento.$key)
          .then(result => {
            console.log('reslt: ', result)
            this.adicionando = false;
            this.favorito = result;
          })
      })
  }

  goToCart(){
    this.navCtrl.setRoot('CarrinhoPage');
  }
}
