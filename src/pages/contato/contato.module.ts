import { ContatoPage } from './contato';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    ContatoPage
  ],
  imports: [
    IonicPageModule.forChild(ContatoPage),
  ],
  exports: [
    ContatoPage
  ]
})
export class ContatoModule {}
