import { LancheDetailPage } from './../lanche-detail/lanche-detail';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';


@Component({
  selector: 'page-filtro-ingredientes',
  templateUrl: 'filtro-ingredientes.html'
})
export class FiltroIngredientesPage {
  ingredientes: any[];
  lanchesFiltrados: any[] = [];
  isLoading = true;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public app: App
    ) {
    this.ingredientes = this.navParams.get('ingredientes');
  }

  ionViewDidLoad() {
    console.log(this.ingredientes);
    this.lanchesFiltrados = [];
    this.isLoading = true;
    this.fireService.getLanchesPorIngredientes(this.ingredientes)
      .subscribe(lanches => {
        this.lanchesFiltrados = [];
        this.filtrarLanches(lanches);
        this.isLoading = false;
      });
  }

  goBack(){
    this.navCtrl.pop();
  }

  filtrarLanches(lanches: any[]){

    let ingredientes_truncados:string = '';
    let aux_filtro = [];
    this.ingredientes.map(ingrediente => {
      ingredientes_truncados += ingrediente.$value;
    })

    lanches.map(lanche => {
      lanche.ingredientes.map(ingrediente => {
        let repetido = false;
        console.log(ingrediente);
        if(ingredientes_truncados.toUpperCase().includes(ingrediente.toUpperCase())){
          aux_filtro.map(aux => {
            if(lanche == aux)
              repetido = true;
          })
          if(!repetido){
            aux_filtro.push(lanche);
          }
        }
      })
    })
    console.log(aux_filtro);
    this.ingredientes.map(ingrediente => {
      aux_filtro.map((lanche, index) => {
        console.log('lanche: ', lanche);
        if(!lanche.ingredientes_truncados.toUpperCase().includes(ingrediente.$value.toUpperCase())){
          aux_filtro.length == 1? aux_filtro = []: aux_filtro.splice(index,1);
        }
      })
    });


    //É preciso repetir a operação, pois o último elemento do array não é checado na função acima
    this.ingredientes.map(ingrediente => {
      aux_filtro.map((lanche, index) => {
        if(!lanche.ingredientes_truncados.toUpperCase().includes(ingrediente.$value.toUpperCase())){
          aux_filtro.length == 1? aux_filtro = []: aux_filtro.splice(index,1);
        }
      })
    });
    this.lanchesFiltrados = aux_filtro;
  }

  goToLanche(lanche){
    this.app.getRootNav().push(LancheDetailPage,{'lanche': lanche});
  }
}
