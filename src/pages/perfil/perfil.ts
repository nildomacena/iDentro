import { LocalizacaoPage } from './../localizacao/localizacao';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  user: any;
  nome: string = '';
  enderecos: any[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController
    ) {
      this.user = this.navParams.get('user');
      console.log(this.user);
      this.nome = this.user.displayName;
      this.fireService.getEnderecos()
        .subscribe(enderecos => {
          console.log('get enderecos ',enderecos);
          this.enderecos = enderecos;
        })
      console.log(this.enderecos);
  }

  ionViewDidLoad() {

  }

  onSubmit(){
    console.log('nome: ', this.nome);
  }
  excluirEndereco(endereco: any){
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      subTitle: 'Tem certeza que deseja excluir esse endereço?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.fireService.excluirEndereco(endereco);
          }
        }
      ]
    })
    alert.present();
  }

  onSelectEndereco(){
    console.log('Select endereco');
  }

  addEndereco(){
    if(this.enderecos.length >= 3){
      let alert = this.alertCtrl.create({
        title: 'Número de endereços excedido',
        subTitle: 'Só é permitido salvar 3 endereços. Exclua um dos endereços para salvar outro.',
        buttons: [{
          text: 'Ok',
          role: 'cancel'
        }]
      })
      alert.present();
    }
    else{
      let modal = this.modalCtrl.create(LocalizacaoPage);
      modal.present();
    }
  }
}
