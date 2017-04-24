import { LocalizacaoService } from './../services/localizacao.service';
import { CardapioVazioPage } from './../pages/cardapio-vazio/cardapio-vazio';
import { Tab3Page } from './../pages/tab3/tab3';
import { Tab2Page } from './../pages/tab2/tab2';
import { Tab1Page } from './../pages/tab1/tab1';
import { AutocompletePage } from './../pages/autocomplete/autocomplete';
import { LoginPage } from './../pages/login/login';
import { ChatPage } from './../pages/chat/chat';
import { CabecalhoComponent } from './../components/cabecalho/cabecalho';
import { ConfiguracoesPage } from './../pages/configuracoes/configuracoes';
import { BebidasPage } from './../pages/bebidas/bebidas';
import { CardapioPage } from './../pages/cardapio/cardapio';
import { CategoriaPage } from './../pages/categoria/categoria';
import { FavoritosPage } from './../pages/favoritos/favoritos';
import { ContatoPage } from './../pages/contato/contato';
import { ParallaxHeader } from './../components/parallax-header/parallax-header';
import { FiltroIngredientesPage } from './../pages/filtro-ingredientes/filtro-ingredientes';
import { MontagemPage } from './../pages/montagem/montagem';
import { DestaquesPage } from './../pages/destaques/destaques';
import { EstabelecimentosPage } from './../pages/estabelecimentos/estabelecimentos';
import { FireService } from './../services/fire.service';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Geolocation } from '@ionic-native/geolocation';
import { HeaderColor } from '@ionic-native/header-color';
import { NativeGeocoder} from '@ionic-native/native-geocoder';
import { LocationAccuracy } from '@ionic-native/location-accuracy'
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireOfflineModule } from 'angularfire2-offline';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { CallNumber } from '@ionic-native/call-number';
import { Facebook } from '@ionic-native/facebook';
import { Keyboard } from '@ionic-native/keyboard';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { ReactiveFormsModule } from '@angular/forms';

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
    EstabelecimentosPage,
    DestaquesPage,
    MontagemPage,
    FiltroIngredientesPage,
    ContatoPage,
    FavoritosPage,
    CategoriaPage,
    ParallaxHeader,
    CardapioPage,
    BebidasPage,
    ConfiguracoesPage,
    CabecalhoComponent,
    ChatPage,
    LoginPage,
    Tab1Page,
    Tab2Page,
    Tab3Page,
    AutocompletePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false, 
      autoFocusAssist: false
    }),
    AngularFireModule.initializeApp(config),
    AngularFireOfflineModule,
    HttpModule,
    ReactiveFormsModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EstabelecimentosPage,
    DestaquesPage,
    MontagemPage,
    FiltroIngredientesPage,
    ContatoPage,
    FavoritosPage,
    CategoriaPage,
    CardapioPage,
    BebidasPage,
    ConfiguracoesPage,
    ChatPage,
    LoginPage,
    Tab1Page,
    Tab2Page,
    Tab3Page,
    AutocompletePage
  ],
  providers: [
    FireService, 
    LocalizacaoService,
    GoogleMaps,
    Diagnostic,
    Geolocation,
    HeaderColor,
    StatusBar,
    SplashScreen,
    CallNumber,
    Keyboard,
    Facebook,
    NativeGeocoder,
    LocationAccuracy,
    {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
