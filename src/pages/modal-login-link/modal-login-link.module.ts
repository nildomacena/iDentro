import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalLoginLink } from './modal-login-link';

@NgModule({
  declarations: [
    ModalLoginLink,
  ],
  imports: [
    IonicPageModule.forChild(ModalLoginLink),
  ],
  exports: [
    ModalLoginLink
  ]
})
export class ModalLoginLinkModule {}
