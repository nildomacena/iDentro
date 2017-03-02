import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-lanche-detail',
  templateUrl: 'lanche-detail.html'
})
export class LancheDetailPage {
  lanche: any;
  justAddedToCart: boolean = false;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public fireService: FireService
    ) {
      let key_lanche = this.navParams.get('lanche').$key;
      
      this.fireService.getLancheByKey(key_lanche)
        .subscribe(lanche => {
          this.lanche = lanche;
          console.log(this.lanche);
        })
      
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LancheDetailPage');
  }

  goBack(){
    console.log(this.fireService.getCart());
  }

  addToCart(){
    this.justAddedToCart = true;
    this.fireService.addToCart(this.lanche);
    let toast = this.toastCtrl.create({
      message: this.lanche.nome+' adicionado ao carrinho',
      duration: 2500,
      showCloseButton: true,
      closeButtonText: 'x',
      dismissOnPageChange: true
    })
    setTimeout(() => {
      this.justAddedToCart = false;
    }, 2500)
    toast.present();
  }
}
