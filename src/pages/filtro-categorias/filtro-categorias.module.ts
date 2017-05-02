import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FiltroCategorias } from './filtro-categorias';

@NgModule({
  declarations: [
    FiltroCategorias,
  ],
  imports: [
    IonicPageModule.forChild(FiltroCategorias),
  ],
  exports: [
    FiltroCategorias
  ]
})
export class FiltroCategoriasModule {}
