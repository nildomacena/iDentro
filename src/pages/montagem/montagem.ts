import { FiltroIngredientesPage } from './../filtro-ingredientes/filtro-ingredientes';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Checkbox } from 'ionic-angular';


@Component({
  selector: 'page-montagem',
  templateUrl: 'montagem.html'
})
export class MontagemPage {
  isLoading: boolean = true;
  ingredientes: any[];
  checkbox: any;
  ingredientesSelecionados: string[] = [];
  categoria: any;
  selecionouIngrediente: boolean = true;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService
    ) {
      this.categoria = this.navParams.get('categoria');
    }

  ionViewDidLoad() {
    this.selecionouIngrediente = false;
    this.fireService.getIngredientes()
      .subscribe(ingredientes => {
        this.isLoading = false;
        this.ingredientes = ingredientes;
      })
  }

  filtrar(){
    this.navCtrl.push(FiltroIngredientesPage, {'ingredientes': this.ingredientesSelecionados, 'categoria': this.categoria},{animate: false});
  }

  onChange(event: Checkbox, ingrediente: any){
    console.log(ingrediente);
    if(event.checked){
      this.ingredientesSelecionados.push(ingrediente.nome);
    }
    if(!event.checked){
      let index = this.ingredientesSelecionados.findIndex((element) => {
        return element == ingrediente.nome;
      })
      this.ingredientesSelecionados.splice(index,1);
    }
    this.selecionouIngrediente = this.ingredientesSelecionados.length > 0;
    console.log(this.ingredientesSelecionados, this.selecionouIngrediente);
  }
}
