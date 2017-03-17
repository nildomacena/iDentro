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
      ingredientes_truncados += ingrediente.nome;
    })

    lanches.map(lanche => {
      console.log(lanche);
      if(lanche.ingredientes){
        lanche.ingredientes.map(ingrediente => {
          let repetido = false;
          console.log(ingrediente);
          if(ingredientes_truncados.toUpperCase().includes(ingrediente.nome.toUpperCase())){
            aux_filtro.map(aux => {
              if(lanche == aux)
                repetido = true;
            })
            if(!repetido){
              aux_filtro.push(lanche);
            }
          }
        });
      }
    })
    //console.log(aux_filtro);
    this.ingredientes.map(ingrediente => {
      aux_filtro.map((lanche, index) => {
    //    console.log('lanche: ', lanche);
        if(!lanche.ingredientes_truncados.toUpperCase().includes(ingrediente.nome.toUpperCase())){
          aux_filtro.length == 1? aux_filtro = []: aux_filtro.splice(index,1);
        }
      })
    });


    //É preciso repetir a operação, pois o último elemento do array não é checado na função acima
    this.ingredientes.map(ingrediente => {
      aux_filtro.map((lanche, index) => {
        if(!lanche.ingredientes_truncados.toUpperCase().includes(ingrediente.nome.toUpperCase())){
          aux_filtro.length == 1? aux_filtro = []: aux_filtro.splice(index,1);
        }
      })
    });
    //this.lanchesFiltrados = aux_filtro;
    
    aux_filtro.map(lanche => {
      let inserido: boolean = false;
      console.log(this.lanchesFiltrados, lanche);
      if(this.lanchesFiltrados.length == 0){
        this.lanchesFiltrados.push({
          key: lanche.key_estabelecimento,
          nome: lanche.nome_estabelecimento,
          lanches: [lanche]
        })
        inserido = true;
      }
      else{
        this.lanchesFiltrados.map(estabelecimento => {
          console.log(estabelecimento)
          if(estabelecimento.key == lanche.key_estabelecimento){
            estabelecimento.lanches.push(lanche);
            inserido = true;
            console.log(estabelecimento);
          }
        })
      }
      if(!inserido){
        this.lanchesFiltrados.push({
          key: lanche.key_estabelecimento,
          nome: lanche.nome_estabelecimento,
          lanches: [lanche]
        })
      }
    })
  }

  goToLanche(lanche){
    console.log(lanche);
    this.app.getRootNav().push(LancheDetailPage,{
      'lanche': lanche, 
      'pesquisa': true
    });
  }
}
