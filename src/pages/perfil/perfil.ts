import { LocalizacaoPage } from './../localizacao/localizacao';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  user: any;
  nome: string = '';
  enderecos: any[] = [];
  telefone: string = '';
  userInfo: any;
  isLoading: boolean = true;
  urlAvatar: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    ) {
      this.user = this.navParams.get('user');
      console.log(this.user);
      this.nome = this.user.displayName;

      this.fireService.getCadastroUsuarioById(this.user.uid)
        .subscribe(userInfo => {
          console.log(userInfo);
          this.enderecos = [];
          this.isLoading = false;
          this.userInfo = userInfo;
          if(this.userInfo.telefone)
            this.telefone = this.userInfo.telefone
          if(this.userInfo.enderecos){
            Object.keys(this.userInfo.enderecos).map((key,index) => {
              this.enderecos.push(this.userInfo.enderecos[key]);
              this.enderecos[index]['$key'] = key;
              console.log(this.enderecos);
            })
          }    
        })
       /* 
      this.fireService.getEnderecos()
        .subscribe(enderecos => {
          this.isLoading = false;
          console.log('get enderecos ',enderecos);
          this.enderecos = enderecos;
        })
      console.log(this.enderecos);*/
  }

  ionViewDidLoad() {

  }

  onSubmit(){
    console.log('avatar no perfil', this.urlAvatar);
    let blob: Blob;
    if(!this.urlAvatar){
      this.fireService.updateCadastroUsuario(this.nome,this.telefone)
        .then(_ => {
          let toast = this.toastCtrl.create({
            message: 'Dados salvos com sucesso.',
            duration: 2500,
            showCloseButton: true,
            closeButtonText: 'X'
          })
          toast.present();
        })
    }
    else{
    blob = new Blob()
    let file: File = new File(this.urlAvatar, 'avatar')

      this.fireService.updateCadastroUsuario(this.nome,this.telefone, file)
        .then(_ => {
          let toast = this.toastCtrl.create({
            message: 'Dados salvos com sucesso.',
            duration: 2500,
            showCloseButton: true,
            closeButtonText: 'X'
          })
          toast.present();
        })
    }
  }
  excluirEndereco(endereco: any){
    console.log('endereco: ', endereco)
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      subTitle: 'Tem certeza que deseja excluir esse endereço?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.fireService.excluirEndereco(endereco);
          }
        }
      ]
    })
    alert.present();
  }

  onSelectEndereco(){
    console.log('Select endereco');
  }
  backButtonAction(){
    this.navCtrl.setRoot('HomePage');
  }

  addEndereco(){
    if(this.enderecos.length >= 3){
      let alert = this.alertCtrl.create({
        title: 'Número de endereços excedido',
        subTitle: 'Só é permitido salvar 3 endereços. Exclua um dos endereços para salvar outro.',
        buttons: [{
          text: 'Ok',
          role: 'cancel'
        }]
      })
      alert.present();
    }
    else{
      this.navCtrl.push('LocalizacaoPage');
      /*let modal = this.modalCtrl.create(LocalizacaoPage);
      modal.present();
    }*/
    }
  }
   
}
