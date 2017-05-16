import { FireService } from './../../services/fire.service';
import { Component, ElementRef} from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, IonicPage } from 'ionic-angular';

@Component({
  selector: 'page-configuracoes',
  templateUrl: 'configuracoes.html'
})
export class ConfiguracoesPage {
  bairros: any[];
  bairrosEntrega: any[] = [];
  bairrosLocalizacao: any[] = [];
  categorias: any[] = [];
  categoriaSelecionada: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public element: ElementRef,
    public fireService: FireService
    ) {}

  ionViewDidLoad() {
    this.bairros = this.navParams.get('bairros');
    this.element.nativeElement.parentElement.parentElement.setAttribute("class",this.element.nativeElement.parentElement.parentElement.getAttribute("class")+ " settings")
    this.fireService.getCategoriasEstabelecimento()
      .then(categorias => {
        this.categorias = categorias;
      })
      .catch(err => {
        console.error(err);
      })
    //this.entregaSelect.setTitle('Bairro de Entrega')
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  onSubmit(){
    console.log('onSubmit: ', this.bairrosEntrega, this.bairrosLocalizacao)
    this.viewCtrl.dismiss({
      bairrosEntrega: this.bairrosEntrega,
      bairrosEstabelecimentos: this.bairrosLocalizacao,
      categoria: this.categoriaSelecionada
    })
  }

  limparFiltro(){
    this.viewCtrl.dismiss();
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
  onSelectCategoria(categoria){
    this.categoriaSelecionada = categoria;
  } 

  backButtonAction(){
    this.viewCtrl.dismiss();
  }
}
