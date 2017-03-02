import { ContatoPage } from './../pages/contato/contato';
import { LocalizacaoPage } from './../pages/localizacao/localizacao';
import { CarrinhoPage } from './../pages/carrinho/carrinho';
import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

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
  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
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
}
