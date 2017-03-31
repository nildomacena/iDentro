import { FireService } from './../../services/fire.service';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Content } from 'ionic-angular';


@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  mensagem = '';
  estabelecimento: any;
  mensagens: any[] = [];
  @ViewChild('myContent') content: Content;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public fireService: FireService
    ) {
    this.estabelecimento = this.navParams.get('estabelecimento');
  }

  ionViewDidLoad() {
    this.fireService.getMensagem(this.estabelecimento.$key)
      .subscribe(mensagens => {
        this.mensagens = mensagens;
        setTimeout(() => {
          this.content.scrollToBottom();
        }, 300);
      })
  }

  send(){
    console.log(this.mensagem);
    if(this.mensagem != '')
      this.fireService.enviarMensagem(this.mensagem, this.estabelecimento.$key);
    this.mensagem = '';
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }


}
