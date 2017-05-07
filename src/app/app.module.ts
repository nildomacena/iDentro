//IMPORTS

//Angular e Ionic
import { ConfiguracoesPage } from './../pages/configuracoes/configuracoes';
import { AngularFireOfflineModule } from 'angularfire2-offline';
import { NgModule, ErrorHandler } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';


//Pages
import { MyApp }              from './app.component';
import { Tab3Page }           from './../pages/tab3/tab3';
import { Tab2Page }           from './../pages/tab2/tab2';
import { Tab1Page }           from './../pages/tab1/tab1';
import { CardapioVazioPage }  from './../pages/cardapio-vazio/cardapio-vazio';

//Services
import { LocalizacaoService } from './../services/localizacao.service';
import { FireService }        from './../services/fire.service';


//Ionic Native
import { GoogleMaps }         from '@ionic-native/google-maps';
import { Diagnostic }         from '@ionic-native/diagnostic';
import { Geolocation }        from '@ionic-native/geolocation';
import { HeaderColor }        from '@ionic-native/header-color';
import { NativeGeocoder}      from '@ionic-native/native-geocoder';
import { LocationAccuracy }   from '@ionic-native/location-accuracy'
import { Deeplinks }          from '@ionic-native/deeplinks';
import { AngularFireModule }  from 'angularfire2';
import { SplashScreen }       from '@ionic-native/splash-screen';
import { StatusBar }          from '@ionic-native/status-bar';
import { CallNumber }         from '@ionic-native/call-number';
import { Facebook }           from '@ionic-native/facebook';
import { Keyboard }           from '@ionic-native/keyboard';
import { Push }               from '@ionic-native/push';
import { Firebase }           from '@ionic-native/firebase';
import { SocialSharing }      from '@ionic-native/social-sharing';

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
    Tab1Page,
    Tab2Page,
    Tab3Page,
    ConfiguracoesPage,
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
    Tab1Page,
    Tab2Page,
    Tab3Page,
    ConfiguracoesPage
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
    Deeplinks,
    Push,
    Firebase,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
