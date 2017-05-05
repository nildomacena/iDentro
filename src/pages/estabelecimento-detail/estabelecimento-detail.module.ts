import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EstabelecimentoDetail } from './estabelecimento-detail';

@NgModule({
  declarations: [
    EstabelecimentoDetail,
  ],
  imports: [
    IonicPageModule.forChild(EstabelecimentoDetail),
  ],
  exports: [
    EstabelecimentoDetail
  ]
})
export class EstabelecimentoDetailModule {}
