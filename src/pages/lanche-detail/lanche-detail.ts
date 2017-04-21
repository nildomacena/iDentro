import { CallNumber } from '@ionic-native/call-number';
import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, IonicPage, Toast } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-lanche-detail',
  templateUrl: 'lanche-detail.html'
})
export class LancheDetailPage {
  lanche: any;
  justAddedToCart: boolean = false;
  estabelecimento: any = null;
  pesquisa: boolean; //Variável testa se a página anterior foi a página de pesquisa
  toast: Toast;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public fireService: FireService,
    public callnumber: CallNumber
    ) {
      let key_lanche = this.navParams.get('lanche').$key;
      this.pesquisa = this.navParams.get('pesquisa');
      this.estabelecimento = this.navParams.get('estabelecimento');
      console.log('this.estabelecimento = this.navParams.get(estabelecimento);', this.estabelecimento);
      this.toast = this.toastCtrl.create({
        message: 'Item adicionado ao carrinho',
        duration: 2000,
        closeButtonText: 'X'
      });
      this.fireService.getLancheByKey(key_lanche)
        .subscribe(lanche => {
          this.lanche = lanche;
          console.log(this.lanche);
        })

        if(!this.estabelecimento){
          this.fireService.getEstabelecimentoByKey(this.lanche.estabelecimento_key)
            .subscribe(estabelecimento => {
              this.estabelecimento = estabelecimento;
              console.log('estabelecimento: ',this.estabelecimento);
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
    if(this.pesquisa)
      this.navCtrl.push('EstabelecimentoPage', {estabelecimento: this.estabelecimento});
    else{
      this.navCtrl.pop();
    }
  }
  addToCart(){
    let item: any;
      this.fireService.getLanchePorEstabelecimentoByLancheKey(this.lanche.$key, this.estabelecimento.$key)
        .then(lanche_por_estabelecimento => {
          item = lanche_por_estabelecimento;
          console.log(item);
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
          // Import the AlertController from ionic package 
          // Consume it in the constructor as 'alertCtrl' 
          let alert = this.alertCtrl.create({
            title: 'Erro',
            message: 'Ocorreu um erro ao adicionar o item ao carrinho. Tente adicionar na tela anterior',
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.navCtrl.pop();
                }
              }
            ]
          });
          alert.present();
          console.log(err);
        }
      })
  }

  addToCartantigo(){
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
          handler: () => {this.callnumber.callNumber(this.estabelecimento.celular.numero, false)}
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
          handler: () => {this.callnumber.callNumber(this.estabelecimento.celular, false)}
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
