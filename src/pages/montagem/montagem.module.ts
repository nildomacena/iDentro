import { MontagemPage } from './montagem';

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    MontagemPage
  ],
  imports: [
    IonicPageModule.forChild(MontagemPage),
  ],
  exports: [
    MontagemPage
  ]
})
export class MontagemPageModule {}
