import { FiltroIngredientesPage } from './filtro-ingredientes';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


@NgModule({
  declarations: [
    FiltroIngredientesPage,
  ],
  imports: [
    IonicPageModule.forChild(FiltroIngredientesPage),
  ],
  exports: [
    FiltroIngredientesPage
  ]
})
export class FiltroIngredientesModule {}
