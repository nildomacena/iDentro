import { MontagemPage } from './../montagem/montagem';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';


@Component({
  selector: 'page-categoria',
  templateUrl: 'categoria.html'
})
export class CategoriaPage {
  categorias: any;
  categoriaSelecionada: any = null;
  isLoading: boolean = true;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public app: App
    ) {
      this.fireService.getCategorias()
        .subscribe(categorias => {
          this.categorias = categorias;
          this.isLoading = false;
        })
    } 

  ionViewDidLoad() {

  }
  
  onSelect(categoria){
    this.categoriaSelecionada = categoria;
    console.log(this.categoriaSelecionada);
  }

  irParaIngredientes(){
    this.app.getRootNav().push(MontagemPage, {categoria: this.categoriaSelecionada})
  }
}
