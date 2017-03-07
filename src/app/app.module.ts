import { FechamentoPedidoPage } from './../pages/fechamento-pedido/fechamento-pedido';
import { ContatoPage } from './../pages/contato/contato';
import { LocalizacaoPage } from './../pages/localizacao/localizacao';
import { CardapioPage } from './../pages/cardapio/cardapio';
import { BebidasPage } from './../pages/bebidas/bebidas';
import { ParallaxHeader } from './../components/parallax-header/parallax-header';
import { CarrinhoPage } from './../pages/carrinho/carrinho';
import { LancheDetailPage } from './../pages/lanche-detail/lanche-detail';
import { FiltroIngredientesPage } from './../pages/filtro-ingredientes/filtro-ingredientes';
import { EstabelecimentoPage } from './../pages/estabelecimento/estabelecimento';
import { MontagemPage } from './../pages/montagem/montagem';
import { DestaquesPage } from './../pages/destaques/destaques';
import { EstabelecimentosPage } from './../pages/estabelecimentos/estabelecimentos';
import { FireService } from './../services/fire.service';

import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AngularFireModule } from 'angularfire2';
import { AngularFireOfflineModule } from 'angularfire2-offline';


const config = {
    apiKey: "AIzaSyCZHJ2ywN6nMq8I_KvGlI6jjh1kcZmZC50",
    authDomain: "identro-61529.firebaseapp.com",
    databaseURL: "https://identro-61529.firebaseio.com",
    storageBucket: "identro-61529.appspot.com",
    messagingSenderId: "875199458176"
  };

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    EstabelecimentosPage,
    DestaquesPage,
    MontagemPage,
    EstabelecimentoPage,
    FiltroIngredientesPage,
    LancheDetailPage,
    BebidasPage,
    CardapioPage,
    CarrinhoPage,
    LocalizacaoPage,
    ContatoPage,
    FechamentoPedidoPage,
    ParallaxHeader
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireOfflineModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EstabelecimentosPage,
    DestaquesPage,
    MontagemPage,
    EstabelecimentoPage,
    FiltroIngredientesPage,
    LancheDetailPage,
    BebidasPage,
    CardapioPage,
    LocalizacaoPage,
    ContatoPage,
    FechamentoPedidoPage,
    CarrinhoPage
  ],
  providers: [
    FireService, 
    {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
