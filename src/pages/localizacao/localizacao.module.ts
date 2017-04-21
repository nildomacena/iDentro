import { LocalizacaoPage } from './localizacao';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    LocalizacaoPage,
  ],
  imports: [
    IonicPageModule.forChild(LocalizacaoPage),
  ],
  exports: [
    LocalizacaoPage
  ]
})
export class LocalizacaoPageModule {}
