import { ConfiguracoesPage } from './../pages/configuracoes/configuracoes';
import { BebidasPage } from './../pages/bebidas/bebidas';
import { CardapioPage } from './../pages/cardapio/cardapio';
import { CategoriaPage } from './../pages/categoria/categoria';
import { Tab3Page } from './../pages/tab3/tab3';
import { Tab2Page } from './../pages/tab2/tab2';
import { Tab1Page } from './../pages/tab1/tab1';
import { FavoritosPage } from './../pages/favoritos/favoritos';
import { FechamentoPedidoPage } from './../pages/fechamento-pedido/fechamento-pedido';
import { ContatoPage } from './../pages/contato/contato';
import { LocalizacaoPage } from './../pages/localizacao/localizacao';
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
    CarrinhoPage,
    LocalizacaoPage,
    ContatoPage,
    FechamentoPedidoPage,
    FavoritosPage,
    Tab1Page,
    Tab2Page,
    Tab3Page,
    CategoriaPage,
    ParallaxHeader,
    CardapioPage,
    BebidasPage,
    ConfiguracoesPage
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
    LocalizacaoPage,
    ContatoPage,
    FechamentoPedidoPage,
    FavoritosPage,
    Tab1Page,
    Tab2Page,
    Tab3Page,
    CategoriaPage,
    CarrinhoPage,
    CardapioPage,
    BebidasPage,
    ConfiguracoesPage
  ],
  providers: [
    FireService, 
    {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
