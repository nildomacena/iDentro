import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, App, AlertController } from 'ionic-angular';
import { CallNumber } from 'ionic-native';


@Component({
  selector: 'page-destaques',
  templateUrl: 'destaques.html'
})
export class DestaquesPage {
  estabelecimentos: any[];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public app: App,
    public alertCtrl: AlertController,
    public fireService: FireService
    ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad DestaquesPage');
    this.fireService.getEstabelecimentos()
      .subscribe(estabelecimentos => {
        this.estabelecimentos = estabelecimentos;
      })
  }

  onSelectEstabelecimento(estabelecimento){
    this.app.getRootNav().push(EstabelecimentoPage,{'estabelecimento': estabelecimento});
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
              CallNumber.call(estabelecimento.telefone)
            }
          },
          {
            text: estabelecimento.celular.numero,
            handler: () => {
              CallNumber.call(estabelecimento.celular.numero)
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
                CallNumber.call(estabelecimento.celular)
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
                CallNumber.call(estabelecimento.celular.numero)
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
