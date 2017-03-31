import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html'
})
export class ConfiguracoesPage {
  bairros: any[];
  bairrosEntrega: any[] = [];
  bairrosLocalizacao: any[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public element: ElementRef
    ) {}

  ionViewDidLoad() {
    this.bairros = this.navParams.get('bairros');
    console.log(this.element.nativeElement.parentElement.parentElement );
    this.element.nativeElement.parentElement.parentElement.setAttribute("class",this.element.nativeElement.parentElement.parentElement.getAttribute("class")+ " settings")
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  onSubmit(){
    this.viewCtrl.dismiss({
      bairrosEntrega: this.bairrosEntrega,
      bairrosEstabelecimentos: this.bairrosLocalizacao,
    })
  }

  selectBairroEntrega(){
    if(this.bairros){
      let alert = this.alertCtrl.create();
      alert.setTitle('Escolha o seu bairro');
      alert.addButton({
        text: 'Cancelar',
        role: 'cancel'
      });
      alert.addButton({
        text: 'OK',
        handler: data =>{
          console.log(data);
        }
      })
      this.bairros.map(bairro => {
        alert.addInput({
          type: 'checkbox',
          label: bairro.nome,
          value: bairro
        })
      })
      alert.present();
      alert.onDidDismiss(data => {
        data.map(bairro => {
          this.bairrosEntrega.push(bairro.$key);
        })
        console.log('data', data);
        console.log(`data ${this.bairrosEntrega}`);
      })
    }
  }

  selectBairroEstabelecimento(){
    if(this.bairros){
      let alert = this.alertCtrl.create();
      alert.setTitle('Escolha o seu bairro');
      alert.addButton({
        text: 'Cancelar',
        role: 'cancel'
      });
      alert.addButton({
        text: 'OK',
        handler: data =>{
          console.log(data);
        }
      })
      this.bairros.map(bairro => {
        alert.addInput({
          type: 'checkbox',
          label: bairro.nome,
          value: bairro
        })
      })
      alert.present();
      alert.onDidDismiss(data => {
        data.map(bairro => {
          this.bairrosLocalizacao.push(bairro.$key);
        })
        console.log('data', data);
        console.log(`data ${this.bairrosLocalizacao}`);
      })
    }
  }
}
