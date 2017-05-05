import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ViewController, IonicPage, Events } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
import { FireService } from './../../services/fire.service';
import { Tab3Page } from './../tab3/tab3';
import { Tab2Page } from './../tab2/tab2';
import { Tab1Page } from './../tab1/tab1';

@IonicPage({
  name: 'estabelecimento',
  segment: 'estabelecimento/:estabelecimentoKey',
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-estabelecimento-detail',
  templateUrl: 'estabelecimento-detail.html',
})
export class EstabelecimentoDetail {
  estabelecimentoKey: string;
  estabelecimento: any;
  photo: string;
  favorito: boolean;
  adicionando: boolean = false;
  logado: boolean = false;
  abas: any[] = [];
  tabs: any[] = [];
  tabParams: any;
  qtdeCarrinho: number = 0;
  cardapioVazio: boolean = false;
  carregado: boolean = false;   // Controla se o estabelecimento já foi carregado

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fireService: FireService,
    public platform: Platform,
    public viewCtrl: ViewController,
    public callnumber: CallNumber,
    public events: Events,
    public zone: NgZone
    ) {
      this.estabelecimentoKey = this.navParams.get('estabelecimentoKey');
      this.tabParams = {
        estabelecimento: '',
        abas_key: []
      }
      this.fireService.getEstabelecimentoByKey(this.estabelecimentoKey)
        .subscribe(estabelecimento => {
          this.zone.run(() => {
            this.carregado = true;
            this.estabelecimento = estabelecimento;
            this.abas = this.estabelecimento.abas;
            console.log('this.estabelecimento.abas', this.estabelecimento.abas)
            this.tabParams.estabelecimento = this.estabelecimento;
            this.estabelecimento.imagemCapa? this.photo = this.estabelecimento.imagemCapa : this.photo = 'assets/no-photo.png';
            console.log('estabelecimento ngzone: ',this.estabelecimento);
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

            if(this.fireService.user)
              this.logado = true;
            else{
              this.logado = false;
            }
          console.log('abas: ', this.abas)
          })
        })
      this.qtdeCarrinho = this.fireService.getQuantidadeItensCarrinho();
      this.events.subscribe('quantidade:carrinho', qtde => {
        this.qtdeCarrinho = qtde;
      });
      
  } 

  ionViewDidLoad() {

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
