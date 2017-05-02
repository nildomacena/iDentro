import { HomePage } from './../pages/home/home';
import { PerfilPage } from './../pages/perfil/perfil';
import { LoginPage } from './../pages/login/login';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HeaderColor } from '@ionic-native/header-color';
import { FireService } from './../services/fire.service';
import { FavoritosPage } from './../pages/favoritos/favoritos';
import { ContatoPage } from './../pages/contato/contato';
import { LocalizacaoPage } from './../pages/localizacao/localizacao';
import { CarrinhoPage } from './../pages/carrinho/carrinho';
import { Component, ViewChild } from '@angular/core';
import { Platform, App, ViewController, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import * as firebase from 'firebase';


@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {
  public nav: any;
  user: any;
  logado = true;
  constructor(
    public platform: Platform, 
    public headerColor: HeaderColor,
    public fireService: FireService, 
    public statusBar: StatusBar,
    public splashscreen: SplashScreen,
    public app: App) {
    platform.ready().then(() => {
      this.headerColor.tint('#e65100');
      firebase.auth().onAuthStateChanged(user => {
        console.log('User app component: ', user);
        if(!user){
          console.log('Logout');
          this.logado = false;
          this.nav.setRoot(LoginPage);
        }
        else{
          this.nav.setRoot('HomePage');
          this.user = user;
          this.logado = true;
        } 
      })
      this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      this.splashscreen.hide();
      /*
      this.platform.registerBackButtonAction(() => {
          let nav = app.getActiveNav();
          let activeView: ViewController = nav.getActive();
          console.log('activeView: ',activeView);
          console.log('nav: ', nav);
          console.log('this.nav.getActive(): ',this.nav.getActive());
          console.log('this.nav.getActive().component: ',this.nav.getActive().component);
          if(activeView != null){
            if(nav.canGoBack()) {
              nav.pop();
            }
            else if (typeof activeView.instance.backButtonAction === 'function'){
              console.log('activeviewInstance: ', activeView.instance);
              activeView.instance.backButtonAction();
            }
            else nav.parent.select(0); // goes to the first tab
          }  
      }, 100)*/
    }); 
  }


  goToPerfil(){
    this.app.getRootNav().push('PerfilPage', {user: this.user });
  }
  goToHome(){
    this.app.getRootNav().push('HomePage');
  }

  goToCarrinho(){
    this.app.getRootNav().push('CarrinhoPage');
  }
  goToLocalizacao(){
    this.nav.push(LocalizacaoPage);
  }

  goToContato(){
    this.app.getRootNav().push(ContatoPage);
  }
  goToFavoritos(){
    this.app.getRootNav().push(FavoritosPage);
  }
  goToPedidos(){
    this.app.getRootNav().push('Pedidos');
  }
  login(){
    this.app.getRootNav().push(HomePage);
  }
  logout(){
    this.fireService.logout()
      .then(_ => {
        this.user = null;
      })
  }
}
