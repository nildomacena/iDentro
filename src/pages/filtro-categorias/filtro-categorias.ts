import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-filtro-categorias',
  templateUrl: 'filtro-categorias.html',
})
export class FiltroCategorias {
  categorias: any[] = [];
  categoriaSelecionada: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fireService: FireService,
    public app: App
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FiltroCategorias');
    this.getCatorias();
  }

  getCatorias(){
    this.fireService.getCategorias()
      .then(categorias => {
        this.categorias = categorias;
      })
  }

  onSelectCategoria(categoria){
    console.log(categoria);
    this.categoriaSelecionada = categoria;
  }

  irParaIngredientes(){
    this.app.getRootNav().push('MontagemPage', {'categoria': this.categoriaSelecionada})
  }

}
