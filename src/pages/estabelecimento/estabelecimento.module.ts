import { CardapioVazioPage } from './../cardapio-vazio/cardapio-vazio';
import { EstabelecimentoPage } from './estabelecimento';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    EstabelecimentoPage,
    CardapioVazioPage
  ],
  imports: [
    IonicPageModule.forChild(EstabelecimentoPage),
  ],
  exports: [
    EstabelecimentoPage
  ],
  entryComponents: [ 
    CardapioVazioPage
  ]
})
export class EstabelecimentosPageModule {}
