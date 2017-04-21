import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Registrar } from './registrar';

@NgModule({
  declarations: [
    Registrar,
  ],
  imports: [
    IonicPageModule.forChild(Registrar),
  ],
  exports: [
    Registrar
  ]
})
export class RegistrarModule {}
