import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-registrar',
  templateUrl: 'registrar.html',
})

export class Registrar {
  email: string = '';
  password: string = '';
  link: boolean = false; // Verifica se a página foi chamada para linkar contas
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Registrar');
  }

  registrar(){
    this.fireService.registerUser(this.email, this.password);
  }

}
