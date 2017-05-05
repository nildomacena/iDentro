import { DestaquesPage } from './destaques';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    DestaquesPage
  ],
  imports: [
    IonicPageModule.forChild(DestaquesPage),
  ],
  exports: [
    DestaquesPage
  ]
})
export class DestaquesModule {}
