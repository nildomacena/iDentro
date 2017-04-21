import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-modal-login-link',
  templateUrl: 'modal-login-link.html',
})
export class ModalLoginLink {
  email: string = '';
  password: string = '';
  credential: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
    ) {
      this.credential = this.navParams.get('credential');
    }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalLoginLink');
  }

  login(){
    let loading = this.loadingCtrl.create({
      content: 'Carregando'
    });
    this.fireService.loginWithEmailAndPassword(this.email,this.password, this.credential)
      .then(_ => {
        loading.dismiss();
        console.log('linkado');
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

}
