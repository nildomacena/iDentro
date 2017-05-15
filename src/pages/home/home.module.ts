import { SuperTabsModule } from 'ionic2-super-tabs';
import { FiltroCategorias } from './../filtro-categorias/filtro-categorias';
import { HomePage } from './home';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    HomePage
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    SuperTabsModule
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}
