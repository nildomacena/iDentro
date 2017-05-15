import { SocialSharing } from '@ionic-native/social-sharing';
import { ChatPage } from './../chat/chat';
import { CallNumber } from '@ionic-native/call-number';
import { FireService } from './../../services/fire.service';
import { Tab3Page } from './../tab3/tab3';
import { Tab2Page } from './../tab2/tab2';
import { Tab1Page } from './../tab1/tab1';
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, Platform, ViewController, IonicPage, Events, ActionSheetController, ModalController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-estabelecimento',
  templateUrl: 'estabelecimento.html'
})
export class EstabelecimentoPage {
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
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fireService: FireService,
    public platform: Platform,
    public viewCtrl: ViewController,
    public callnumber: CallNumber,
    public events: Events,
    public actionSheet: ActionSheetController,
    public modalCtrl: ModalController,
    public share: SocialSharing,
    public zone: NgZone
    ) {
    this.tabParams = {
      estabelecimento: '',
      abas_key: []
    }

    this.qtdeCarrinho = this.fireService.getQuantidadeItensCarrinho();
    this.events.subscribe('quantidade:carrinho', qtde => {
      this.qtdeCarrinho = qtde;
    });
    this.estabelecimento = this.navParams.get('estabelecimento');
    this.tabParams.estabelecimento = this.estabelecimento;

    this.abas = this.estabelecimento.abas;
    try{
      this.zone.run(() => {
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
      })
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

    if(this.estabelecimento.telefone2.numero && this.estabelecimento.telefone1.numero){
      buttons = [
        {
          text: this.estabelecimento.telefone1.numero,
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

    else if(this.estabelecimento.telefone2.numero){
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

    else if(this.estabelecimento.telefone1.numero){
      buttons = [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Ligar',
          handler: () => {this.callnumber.callNumber(this.estabelecimento.telefone1.numero, true)}
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
    console.log('addtofavorito');
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
  openChat(){
    let chatModal = this.modalCtrl.create('ChatPage', {estabelecimento: this.estabelecimento});
    chatModal.present();
  }
  openSettings(){
    console.log('open settings');

    let action = this.actionSheet.create({
      title: this.estabelecimento.nome,
      buttons: [
        {
         text: 'Compartilhar',
         role: 'destructive',
         icon: 'share',
         handler: () => {
          let options = {
            message: `Venha conferir as ofertas do ${this.estabelecimento.nome} no aplicativo Bolts:`, // not supported on some apps (Facebook, Instagram)
            subject: 'Bolts', // fi. for email
            files: '', // an array of filenames either locally or remotely
            url: `meubiu.com.br/estabelecimento/${this.estabelecimento.$key}`,
            chooserTitle: 'Bolts' // Android only, you can override the default share sheet title
          }
           this.share.shareWithOptions(options)
            .then(result => {
              console.log(result);
            })
            .catch(err => {
              console.log(err);
            })
         }
        },
        {
         text: 'Abrir chat',
         role: 'destructive',
         icon: 'text',
         handler: () => {
          this.openChat();
         }
        },
        {
         text: 'Cancelar',
         role: 'cancel',
         icon: 'close',
         handler: () => {

         },
        }
      ]
    });
    if(!this.estabelecimento.organico){
      if(!this.favorito){
        action.addButton({
          text: 'Adicionar aos favoritos',
          role: 'destructive',
          icon: 'heart',
          handler: () => {
            this.addToFavorito();
          }
        })
      }
      else{
        action.addButton({
          text: 'Retirar dos favoritos',
          role: 'destructive',
          icon: 'heart-outline',
          handler: () => {
            this.addToFavorito();
          }
        })
      }
      
      try{
        if(this.estabelecimento.localizacao.lat && this.estabelecimento.localizacao.lng){
          action.addButton({
            text: 'Abrir localização no mapa',
            role: 'destructive',
            icon: 'map',
            handler: () => {
              let linkLocalizacao = "http://maps.google.com/maps?q=" + this.estabelecimento.localizacao.lat + ',' + this.estabelecimento.localizacao.lng + "("+ this.estabelecimento.nome +")&z=15";
              window.open(linkLocalizacao);
            }
          })
        }
      }
      catch(err){
        console.log(err);
      }
    }
    
    action.present();
  }
  goToCart(){
    this.navCtrl.setRoot('CarrinhoPage');
  }
}
