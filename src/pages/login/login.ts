import { FireService } from './../../services/fire.service';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, Platform } from 'ionic-angular';
import * as firebase from 'firebase';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: string = ''
  senha: string = ''
  loading: Loading;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public loadingCtrl: LoadingController,
    public platform: Platform
    ) {
      this.loading = this.loadingCtrl.create({
        content: 'Carregando informações'
      })
  }

  ionViewDidLoad() {
    console.log('User assim que o login abre: ', firebase.auth().currentUser);
    setTimeout(() => {
      console.log('User settimeout: ', firebase.auth().currentUser);  
    },500)

      firebase.auth().onAuthStateChanged(user => {
        console.log(this.loading._state)
        console.log(user);
        if(user){
          this.navCtrl.setRoot(HomePage);
        }
      })
  }

  login(){
    this.navCtrl.setRoot(HomePage);
  }

  loginWithFacebook(){
      this.fireService.loginWithFacebook()
        .then(_ => {
          console.log('Logado');
        })
        .catch(err => {
          console.log(err);
        })
  }

  backButtonAction(){
    this.platform.exitApp();
  }
}
