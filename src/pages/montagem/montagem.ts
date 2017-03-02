import { FiltroIngredientesPage } from './../filtro-ingredientes/filtro-ingredientes';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Checkbox } from 'ionic-angular';


@Component({
  selector: 'page-montagem',
  templateUrl: 'montagem.html'
})
export class MontagemPage {

  ingredientes: any[];
  checkbox: any;
  ingredientesSelecionados: string[] = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService
    ) {}

  ionViewDidLoad() {
    this.fireService.getIngredientes()
      .subscribe(ingredientes => {

        this.ingredientes = ingredientes;
        console.log(this.ingredientes);
      })
  }

  console(){
    this.navCtrl.push(FiltroIngredientesPage, {'ingredientes': this.ingredientesSelecionados},{animate: false});
  }

  onChange(event: Checkbox, ingrediente){
    if(event.checked)
      this.ingredientesSelecionados.push(ingrediente);
    if(!event.checked){
      let index = this.ingredientesSelecionados.findIndex((element) => {
        return element == ingrediente;
      })
      this.ingredientesSelecionados.splice(index,1);
    }
  }
}
