import { ChatPage } from './../chat/chat';
import { CallNumber } from '@ionic-native/call-number';
import { LancheDetailPage } from './../lanche-detail/lanche-detail';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, App, AlertController, ModalController, IonicPage, Events } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-tab3',
  templateUrl: 'tab3.html'
})
export class Tab3Page {
  itens: any[];
  estabelecimento: any;
  loading: boolean = true;
  aba_key: string = '';
  qtdeCarrinho: number = 0;
  linkLocalizacao: string = '';
  currentUser: any;
  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public fireService: FireService,
    public modalCtrl: ModalController,
    public callnumber: CallNumber,
    public app: App,
    public events: Events
    ) {
      this.estabelecimento = this.navParams.data.estabelecimento;
      this.aba_key = this.navParams.data.abas_key[2];
      this.events.subscribe('quantidade:carrinho', qtde => {
        console.log('quantidade:carrinho: ', qtde);
        this.qtdeCarrinho = qtde;
      });
      if(this.estabelecimento.localizacao.lat && this.estabelecimento.localizacao.lng){
        this.linkLocalizacao = "http://maps.google.com/maps?q=" + this.estabelecimento.localizacao.lat + ',' + this.estabelecimento.localizacao.lng + "("+ this.estabelecimento.nome +")&z=15";
      }
    }

  ionViewDidLoad() {
    console.log('estabelecimento: ', this.estabelecimento);
    this.fireService.getItensByAba(this.estabelecimento.$key, this.aba_key)
      .subscribe(itens => {
        this.loading = false;
        this.itens = itens;
        this.currentUser = firebase.auth().currentUser;
      })
  }

  goToItem(item){
    console.log(item);
    this.app.getRootNav().push('LancheDetailPage', {lanche: item, estabelecimento: this.estabelecimento});

  }
  goToChat(){
    console.log('chat');
    let modal = this.modalCtrl.create(ChatPage, {estabelecimento: this.estabelecimento});
    modal.present();

  }
call(){
      let buttons;
      let subTitle;
      
      this.estabelecimento.telefone2 && this.estabelecimento.telefone1? subTitle = 'Selecione o número para o qual deseja ligar.': 'Deseja realmente ligar?'

      if(this.estabelecimento.telefone1 && this.estabelecimento.telefone2){
        buttons = [
          {
            text: this.estabelecimento.telefone1.numero,
            handler: () => {
              this.callnumber.callNumber(this.estabelecimento.telefone1.numero, true)
            }
          },
          {
            text: this.estabelecimento.telefone2.numero,
            handler: () => {
              this.callnumber.callNumber(this.estabelecimento.telefone2.numero, true)
            }
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
              handler: () => {
                this.callnumber.callNumber(this.estabelecimento.telefone2, true)
              }
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
              handler: () => {
                this.callnumber.callNumber(this.estabelecimento.telefone2.numero, true)
              }
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
  goToCarrinho(){
    this.app.getRootNav().push('CarrinhoPage');
  }

}
