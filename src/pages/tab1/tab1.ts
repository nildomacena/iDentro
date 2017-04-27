import { ChatPage } from './../chat/chat';
import { HomePage } from './../home/home';
import { CallNumber } from '@ionic-native/call-number';
import { LancheDetailPage } from './../lanche-detail/lanche-detail';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, App, AlertController, ViewController, ModalController, ToastController, Toast, IonicPage, Events } from 'ionic-angular';


@Component({
  selector: 'page-tab1',
  templateUrl: 'tab1.html'
})
export class Tab1Page {
  itens: any[];
  estabelecimento: any;
  loading: boolean = true;
  aba_key: string = '';
  toast: Toast;
  qtdeCarrinho: number = 0;
  linkLocalizacao: string = '';
  constructor(
    public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public fireService: FireService,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public callnumber: CallNumber,
    public app: App,
    public events: Events
    ) {
      this.estabelecimento = this.navParams.data.estabelecimento;
      if(this.estabelecimento.localizacao.lat && this.estabelecimento.localizacao.lng){
        this.linkLocalizacao = "http://maps.google.com/maps?q=" + this.estabelecimento.localizacao.lat + ',' + this.estabelecimento.localizacao.lng + "("+ this.estabelecimento.nome +")&z=15";
      }
      this.aba_key = this.navParams.data.abas_key[0];
      this.toast = this.toastCtrl.create({
        message: 'Item adicionado ao carrinho',
        duration: 2000,
        closeButtonText: 'X'
      })
      this.events.subscribe('quantidade:carrinho', qtde => {
        console.log('quantidade:carrinho: ', qtde);
        this.qtdeCarrinho = qtde;
      });
    }

  ionViewDidLoad() {
    this.fireService.getItensByAba(this.estabelecimento.$key, this.aba_key)
      .subscribe(itens => {
        this.loading = false;
        this.itens = itens;
        this.truncarIngredientes();
      })
  }

  addToCart(item: any){
    try{
      let result = this.fireService.addToCart(item, this.estabelecimento);
      if(result != true){
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Você possui itens de outro estabelecimento adicionados no carrinho. Deseja limpar o carrinho?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Ok',
              handler: () => {
                this.fireService.limpaCarrinho()
              }
            }
          ]
        })
        alert.present();  
      }
      else{
        this.toast.present();
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  goToItem(item){
    this.app.getRootNav().push('LancheDetailPage', {lanche: item, estabelecimento: this.estabelecimento});

  }
  goToChat(){
    let modal = this.modalCtrl.create(ChatPage, {estabelecimento: this.estabelecimento});
    modal.present();

  }
  truncarIngredientes(){
    this.itens.map(item => {
      try {
        let tamanho = Object.keys(item.ingredientes).length
        if(item.ingredientes){
          Object.keys(item.ingredientes).map((key, index) => {
            if(index == 0 )
              item.ingredientes_truncados = item.ingredientes[key].nome; 
            
            else if(index + 1 < tamanho)
              item.ingredientes_truncados += ', '+item.ingredientes[key].nome;
            else
              item.ingredientes_truncados += ' e '+item.ingredientes[key].nome;
          })
        }
      } 
      
      catch (err) {
        console.log(err)
      }
    })
  }
  call(){
      let buttons;
      let subTitle;
      
      this.estabelecimento.telefone2 && this.estabelecimento.telefone1? subTitle = 'Selecione o número para o qual deseja ligar.': 'Deseja realmente ligar?'

      if(this.estabelecimento.telefone1 && this.estabelecimento.telefone1){
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

  backButtonAction(){
    console.log('Estabelecimento backbuttonaction');
    //this.viewCtrl._nav.popToRoot
    this.app.getRootNav().pop();
  }

  goToCarrinho(){
    this.app.getRootNav().setRoot('CarrinhoPage');
  }
}
