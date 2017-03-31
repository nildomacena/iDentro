import { Component } from '@angular/core';

@Component({
  selector: 'cabecalho',
  templateUrl: 'cabecalho.html'
})
export class CabecalhoComponent {

  text: string;

  constructor() {
    console.log('Hello Cabecalho Component');
    this.text = 'Hello World';
  }

}
