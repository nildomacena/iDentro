import { FireService } from './../../services/fire.service';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, Platform, AlertController } from 'ionic-angular';
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
    public alertCtrl: AlertController,
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
          this.navCtrl.setRoot('HomePage');
        }
      })
  }

  login(){
    let loading = this.loadingCtrl.create({
      content: 'Carregando'
    });
    loading.present();
    this.fireService.loginWithEmailAndPassword(this.email,this.senha)
      .then(_ => {
        loading.dismiss();
      })
      .catch(err => {
        let mensagem: string;
        if(err['code'] == 'auth/wrong-password'){
          mensagem = 'Usuário ou senha estão incorretos. Verifique as informações digitadas.'
        }
        else if(err['code'] == 'auth/invalid-email'){
          mensagem = 'Digite um email válido.';
        }
        else if(err['code'] == 'auth/user-not-found'){
          mensagem = 'Usuário não encontrado.';
        }
        else{
          mensagem = 'Ocorreu algum erro durante o login. Tente novamente mais tarde.'
        }
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: mensagem,
          buttons: [{
            text: 'Ok',
            role: 'cancel'
          }]
        })
        alert.present();
        alert.onWillDismiss(() => {
          loading.dismiss()
        });
        console.error(err);
      })
  }


  loginWithFacebook(){
    if(this.platform.is('cordova')){
      this.fireService.loginWithFacebookNative()
        .then(result => {
          console.log('result: ', result, typeof(result));
          if(result.code == 'auth/account-exists-with-different-credential'){
            this.navCtrl.push('ModalLoginLink', {credential: result.credential})
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
    else{
      this.fireService.loginWithFacebookWeb()
        .then(result => {
          console.log('result: ', result, typeof(result));
          if(result.code == 'auth/account-exists-with-different-credential'){
            this.navCtrl.push('ModalLoginLink', {credential: result.credential})
          }
        })
        .catch(err => {
          console.log(err);
        })
    }

  }
  recuperarSenha(){
    let alertResultado = this.alertCtrl.create({
      title: 'Sucesso',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel'
        }
      ]
    });
    
    if(this.email == ''){
      let alertEmailVazio = this.alertCtrl.create({
        title: 'Erro',
        message: 'Preencha o seu email no campo indicado',
        buttons: [
          {
          text: 'Cancel', 
          role: 'cancel',
          handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Ok',
            handler: () => {
              console.log('Ok clicked');
            }
          }
        ]
      });
      alertEmailVazio.present();
    }
    else{
      let alert1 = this.alertCtrl.create({
        title: 'Recuperação de senha',
        message: `Deseja enviar um email de recuperação de senha para ${this.email}?`,
        buttons: [
          {
          text: 'Cancel', 
          role: 'cancel',
          handler: () => {
              console.log('Cancel clicked');
            }
          }, 
          {
            text: 'Ok',
            handler: () => {
              this.fireService.recuperarSenha(this.email)
                .then(_ => {
                  alertResultado.setMessage('Solicitação enviada com sucesso. Verifique o seu email');
                  alertResultado.present();
                })
                .catch(err => {
                  let mensagem: string;
                  if(err['code'] == 'auth/invalid-email'){
                    mensagem = 'Digite um email válido.';
                  }
                  else if(err['code'] == 'auth/user-not-found'){
                    mensagem = 'Usuário não encontrado.';
                  }
                  else{
                    mensagem = 'Ocorreu algum erro durante a solicitação. Verifique o email digitado e tente novamente mais tarde.';
                  }
                  console.error(err);
                  alertResultado.setTitle('Erro');
                  alertResultado.setMessage(mensagem);
                  alertResultado.present();
                })
            }
          }
        ]
      });
      alert1.present();
    }
  }

  register(){
    this.navCtrl.push('Registrar');
  }

  backButtonAction(){
    this.platform.exitApp();
  }
}
