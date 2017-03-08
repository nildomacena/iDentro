import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-localizacao',
  templateUrl: 'localizacao.html'
})
export class LocalizacaoPage {
  bairro: string = '';
  endereco: string = '';
  pontoRef: string = '';
  loading = false;
  modal = false;
  bairros: any[];
  alert: any;
  loadingBairros:boolean = true;
  bairroSelecionado: string = '';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public alertCtrl: AlertController
    ) {
      this.alert = this.alertCtrl.create();
    }

  ionViewDidLoad() {
    this.fireService.getBairros()
      .subscribe(bairros => {
        this.loadingBairros = false;
        this.bairros = bairros;
      })
  }

  addBairro(inputBairro){
    this.loading = true;
    this.fireService.addBairro(this.bairro)
      .then(_ => {
        this.loading = false;
        this.bairro = '';
        inputBairro.setFocus();

      })
  }

  dismiss(){
    this.navCtrl.pop();
  }

  selectBairro(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Selecione seu bairro');
    this.bairros.map(bairro => {
      alert.addInput({
        type: 'radio',
        label: bairro.nome,
        value: bairro.$key
      });
    })
    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.bairroSelecionado = data;
        console.log(this.bairroSelecionado);
        this.fireService.getBairroByKey(this.bairroSelecionado)
          .subscribe(bairro => {
            console.log(bairro);
            this.bairro = bairro.nome;
          })
      }
    })
    alert.present();
  }

  onSubmitEndereco(){
    let obj = {
      endereco: this.endereco,
      pontoRef: this.pontoRef,
      bairro_nome: this.bairro,
      bairro_key: this.bairroSelecionado
    };
    console.log(obj);
  }
}
