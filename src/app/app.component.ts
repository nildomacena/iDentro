import { HeaderColor } from '@ionic-native/header-color';
import { FireService } from './../services/fire.service';
import { FavoritosPage } from './../pages/favoritos/favoritos';
import { ContatoPage } from './../pages/contato/contato';
import { LocalizacaoPage } from './../pages/localizacao/localizacao';
import { CarrinhoPage } from './../pages/carrinho/carrinho';
import { Component, ViewChild } from '@angular/core';
import { Platform, App, ViewController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import * as firebase from 'firebase';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {
  rootPage = HomePage;
  public nav: any;
  user: any;
  logado = false;
  constructor(
    public platform: Platform, 
    public headerColor: HeaderColor,
    public fireService: FireService, 
    public app: App) {
    platform.ready().then(() => {
      this.headerColor.tint('#e65100');
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          this.logado = true;
          this.user = user;
          console.log(user);
        }
        else{
          this.logado = false
        }
      })
      StatusBar.styleDefault();
      Splashscreen.hide();

      this.platform.registerBackButtonAction(() => {
        let nav = app.getActiveNav();
        let activeView: ViewController = nav.getActive();
        console.log('activeView: ',activeView);
        if(activeView != null){
          if(nav.canGoBack()) {
            nav.pop();
          }
          else if (typeof activeView.instance.backButtonAction === 'function')
            activeView.instance.backButtonAction();
          else nav.parent.select(0); // goes to the first tab
        }
      }, 100)
    });
  }

  goToCarrinho(){
    this.nav.push(CarrinhoPage);
  }
  goToLocalizacao(){
    this.nav.push(LocalizacaoPage);
  }

  goToContato(){
    this.nav.push(ContatoPage);
  }
  goToFavoritos(){
    this.nav.push(FavoritosPage)
  }

  loginWithFacebook(){
    this.fireService.loginWithFacebook()
      .then(_ => {

      })
      .catch(err => {
        console.log(err);
      })
  }

  logout(){
    this.fireService.logout()
      .then(_ => {
        this.user = null;
      })
  }
}
