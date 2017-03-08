import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html'
})
export class FavoritosPage {
  favoritos: any[]
  vazio:boolean = false;
  isLoading: boolean = true;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService
    ) {}

  ionViewDidLoad() {
    this.fireService.getFavoritos()
      .subscribe(favoritos => {
        this.isLoading = false;
        this.favoritos = favoritos;
        if(this.favoritos.length == 0){
          this.vazio = true;
        }
      })
  }

  goBack(){
    this.navCtrl.pop();
  }

  onSelectEstabelecimento(estabelecimento){
    console.log(estabelecimento);
    this.fireService.getEstabelecimentoByKey(estabelecimento.key)
      .subscribe(estabelecimento => {
        console.log(estabelecimento);
        this.navCtrl.push(EstabelecimentoPage,{'estabelecimento': estabelecimento});
      })
  }
}
