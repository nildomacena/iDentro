import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';


@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html'
})
export class ConfiguracoesPage {
  bairros: any[];
  bairrosEntrega: any[] = [];
  bairrosLocalizacao: any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    this.bairros = this.navParams.get('bairros');
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  onSubmit(){
    console.log('Bairros entrega: ',this.bairrosEntrega)
    console.log('Bairros Localizacao: ',this.bairrosLocalizacao)
  }
}
