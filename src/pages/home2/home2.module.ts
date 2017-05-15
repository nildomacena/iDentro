import { SuperTabsModule } from 'ionic2-super-tabs';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Home2 } from './home2';

@NgModule({
  declarations: [
    Home2,
  ],
  imports: [
    IonicPageModule.forChild(Home2),
    SuperTabsModule
  ],
  exports: [
    Home2
  ]
})
export class Home2Module {}
