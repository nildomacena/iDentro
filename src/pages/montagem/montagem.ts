import { FiltroIngredientesPage } from './../filtro-ingredientes/filtro-ingredientes';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, Checkbox, AlertController } from 'ionic-angular';


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
  checkboxes: Checkbox[] = [];
  willLeave: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public alertCtrl: AlertController
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

  ionViewDidLeave(){
    this.willLeave = true; //Variável utilizada porque a função onChange está sendo chamada quando os checkboxes são zerados, o que não deveria acontecer.
                           //willLeave checa se o usuário vai sair da página 
    this.checkboxes.map(checkbox => {
      checkbox.checked = false;
    });

    this.checkboxes = [];
    this.selecionouIngrediente = false;
  }

  filtrar(){
    if(!this.selecionouIngrediente){
      let alert = this.alertCtrl.create({
        title: 'Selecione um ingrediente',
        subTitle: 'Selecione ao menos um ingrediente para poder fazer a pesquisa',
        buttons: [{
          text: 'Ok'
        }]
      })
      alert.present();
    }
    else
      this.navCtrl.push(FiltroIngredientesPage, {'ingredientes': this.ingredientesSelecionados, 'categoria': this.categoria},{animate: false});
  }

  onChange(event: Checkbox, ingrediente: any){
    if(!this.willLeave){
      if(event.checked){
        this.ingredientesSelecionados.push(ingrediente.nome);
        this.checkboxes.push(event);
      }
      if(!event.checked){
        let index = this.ingredientesSelecionados.findIndex((element) => {
          return element == ingrediente.nome;
        })
        this.ingredientesSelecionados.splice(index,1);
      }
      this.selecionouIngrediente = this.ingredientesSelecionados.length > 0;
      console.log('Event: ', event);
      console.log('Ingrediente: ', ingrediente);
      console.log('ingredientesSelecionados: ', this.ingredientesSelecionados);
      console.log('Selecionou ingrediente: ', this.selecionouIngrediente);
      }
    }
}
