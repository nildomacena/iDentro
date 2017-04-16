import { LocalizacaoPage } from './../localizacao/localizacao';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';


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
    public modalCtrl: ModalController
    ) {
      this.user = this.navParams.get('user');
      console.log(this.user);
      this.nome = this.user.displayName;
      this.fireService.getEnderecos()
        .subscribe(enderecos => {
          console.log('get enderecos ',enderecos);
          this.enderecos = enderecos;
        })
      /*
      this.enderecos.push('Rua B47, quadra 1. Número 211. Benedito Bentes. Maceió-Al');
      this.enderecos.push('Avenida barros, número 20. Santa Lúcia. Maceió-Al');*/
      console.log(this.enderecos);
  }

  ionViewDidLoad() {

  }

  onSubmit(){
    console.log('nome: ', this.nome);
  }
  onSelectEndereco(){
    console.log('Select endereco');
  }

  addEndereco(){
    let modal = this.modalCtrl.create(LocalizacaoPage);
    modal.present();
  }
}
