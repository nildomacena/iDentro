import { Component, NgZone, ViewChild, ViewChildren } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';

@Component({
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html',
})
export class AutocompletePage {
  autocompleteItems;
  autocomplete = '';
  @ViewChild(Searchbar) searchbar: Searchbar;

  service = new google.maps.places.AutocompleteService();
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public zone: NgZone
    ) {
      this.autocompleteItems = [];
      this.autocomplete = this.navParams.get('data');
      if(this.autocomplete)
        this.updateSearch();

  }

  ionViewDidLoad() {
    console.log('Maceió inclui maceio ?', 'Maceió'.toUpperCase().includes('maceio'.toUpperCase()));
    this.searchbar.setFocus();
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any){
    this.viewCtrl.dismiss(item)
  }

  updateSearch() {
    console.log('autocomplete', this.autocomplete);
    console.log(this.service);
    if (this.autocomplete == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this
    let resquest: google.maps.places.AutocompletionRequest = { 
      input: me.autocomplete,
      componentRestrictions: {
        country: 'BR',
        
      }
    }
    this.service.getPlacePredictions({ input: me.autocomplete, componentRestrictions: {country: 'BR'} }, function (predictions, status) {
      me.autocompleteItems = []; 
      me.zone.run(function () {
        console.log('predictions: ', predictions);
        predictions.forEach(function (prediction){
          if(prediction.description.toUpperCase().includes('Maceió'.toUpperCase()))
            me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }
}
