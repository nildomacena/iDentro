import { MapaPage } from './mapa';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

@NgModule({
  declarations: [
    MapaPage,
  ],
  imports: [
    IonicPageModule.forChild(MapaPage),
  ],
  exports: [
    MapaPage
  ]
})
export class MapaPageModule {}
