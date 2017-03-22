import { MontagemPage } from './../montagem/montagem';
import { FireService } from './../../services/fire.service';
import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';


@Component({
  selector: 'page-categoria',
  templateUrl: 'categoria.html'
})
export class CategoriaPage {
  categorias: any;
  categoriaSelecionada: any = null;
  isLoading: boolean = true;
  radioCategoria: any;
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
  ionViewWillLeave(){
    console.log('Vai sair');
    this.categoriaSelecionada = null;
    this.radioCategoria.checked = false;
  }
  onSelect(categoria, element){
    this.categoriaSelecionada = categoria;
    this.radioCategoria = element;
    //this.radioCategoria.nativeElement.reset();
    console.log('elemnt: ',element);
  }

  irParaIngredientes(){
    this.app.getRootNav().push(MontagemPage, {categoria: this.categoriaSelecionada})
  }
}
