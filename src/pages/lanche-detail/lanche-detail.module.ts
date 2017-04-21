import { LancheDetailPage } from './lanche-detail';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    LancheDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(LancheDetailPage),
  ],
  exports: [
    LancheDetailPage
  ]
})
export class LancheDetailPageModule {}
