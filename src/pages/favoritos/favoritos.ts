import { CallNumber } from 'ionic-native';
import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html'
})
export class FavoritosPage {
  favoritos: any[]
  vazio:boolean = false;
  isLoading: boolean = true;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public fireService: FireService
    ) {}

  ionViewDidLoad() {
    this.fireService.getFavoritos()
      .subscribe(favoritos => {
        this.isLoading = false;
        this.favoritos = favoritos;
        if(this.favoritos.length == 0){
          this.vazio = true;
        }
      })
  }

  goBack(){
    this.navCtrl.pop();
  }

  onSelectEstabelecimento(estabelecimento){
    console.log(estabelecimento);
    this.fireService.getEstabelecimentoByKey(estabelecimento.key)
      .subscribe(estabelecimento => {
        console.log(estabelecimento);
        this.navCtrl.push(EstabelecimentoPage,{'estabelecimento': estabelecimento});
      })
  }

  call(estabelecimento){
      let buttons;
      let subTitle;
      
      estabelecimento.celular && estabelecimento.telefone? subTitle = 'Selecione o número para o qual deseja ligar.': 'Deseja realmente ligar?'

      if(estabelecimento.celular && estabelecimento.telefone){
        buttons = [
          {
            text: estabelecimento.telefone,
            handler: () => {
              CallNumber.callNumber(estabelecimento.telefone, true)
            }
          },
          {
            text: estabelecimento.celular.numero,
            handler: () => {
              CallNumber.callNumber(estabelecimento.celular.numero, true)
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      }
      else if(estabelecimento.celular){
          buttons = [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Ligar',
              handler: () => {
                CallNumber.callNumber(estabelecimento.celular, true)
              }
            }
          ]
        }

        else if(estabelecimento.telefone){
          buttons = [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Ligar',
              handler: () => {
                CallNumber.callNumber(estabelecimento.celular.numero, true)
              }
            }
          ]
        }

        let alert = this.alertCtrl.create({
          title: 'Ligar para '+estabelecimento.nome,
          subTitle: subTitle,
          buttons: buttons
        });
        alert.present();
      }
}
