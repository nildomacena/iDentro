import { EstabelecimentosPage } from './estabelecimentos';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


@NgModule({
  declarations: [
    EstabelecimentosPage
  ],
  imports: [
    IonicPageModule.forChild(EstabelecimentosPage),
  ],
  exports: [
    EstabelecimentosPage
  ]
})
export class EstabelecimentosPageModule {}
