import { CategoriaPage } from './../categoria/categoria';
import { MontagemPage } from './../montagem/montagem';
import { DestaquesPage } from './../destaques/destaques';
import { EstabelecimentosPage } from './../estabelecimentos/estabelecimentos';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  estabelecimentos: any[];
  estabelecimentosPage = EstabelecimentosPage;
  destaquesPage = DestaquesPage;
  categoriaPage = CategoriaPage;

  constructor(
    public navCtrl: NavController,
    public fireService: FireService
    ) {
    
  }

  ionViewDidLoad(){
    
  }

}
