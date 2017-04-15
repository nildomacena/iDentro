import { AutocompletePage } from './../autocomplete/autocomplete';
import { GoogleMap, GoogleMaps, Geocoder, GeocoderResult, GeocoderRequest } from '@ionic-native/google-maps';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
//import { GoogleMaps } from '@types/googlemaps';

@Component({
  selector: 'page-localizacao',
  templateUrl: 'localizacao.html'
})
export class LocalizacaoPage {
  bairro: string = '';
  endereco: string = '';
  pontoRef: string = '';
  loading = false;
  modal = false;
  bairros: any[];
  alert: any;
  cep: string = '';
  logradouro: string = '';
  loadingBairros:boolean = true;
  bairroSelecionado: string = '';
  autocomplete: any;
  address: any;
  numero: string = '';
  geocoder: Geocoder = new Geocoder();

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public fireService: FireService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public nativeGeocoder: NativeGeocoder,
    public loadingCtrl: LoadingController,
    public googleMaps: GoogleMaps,

    ) {
      this.address = {
        place: ''
      };
      this.alert = this.alertCtrl.create();
    }

  ionViewDidLoad() {
    this.fireService.getBairros()
      .subscribe(bairros => {
        this.loadingBairros = false;
        this.bairros = bairros;
      })
  }

  addBairro(inputBairro){
    this.loading = true;
    this.fireService.addBairro(this.bairro)
      .then(_ => {
        this.loading = false;
        this.bairro = '';
        inputBairro.setFocus();

      })
  }

  buscarEnderecoPorCEP(){
    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    let request: GeocoderRequest;
    request.address = this.cep;
    console.log('request: ', request);
    this.geocoder.geocode(request)
      .then(result => {
        loading.dismiss();
        console.log('result buscar pelo endereco: ', result)
      })
    /*
    this.nativeGeocoder.forwardGeocode(this.cep)
      .then(result => {
        console.log(result);
        this.nativeGeocoder.reverseGeocode(+result.latitude, +result.longitude)
          .then(reverseResult => {
            loading.dismiss();
            console.log(reverseResult);
          })
      })*/
  }

  showAddressModal(){
    console.log('show address modal');
    let modal = this.modalCtrl.create(AutocompletePage,{data: this.address.place});
    modal.onDidDismiss(data => {
      if(data){
        let request: google.maps.GeocoderRequest = {
          address: data
        };
        let geocoder: google.maps.Geocoder = new google.maps.Geocoder();
        geocoder.geocode(request, (value) => {
          let result = value[0]
          console.log(result);
          this.address.place = `${result['address_components'][0].short_name}, ${result['address_components'][1].short_name}, ${result['address_components'][2].short_name}`
          console.log('address data = ', this.address.place);
          console.log('geocoder result: ', result);
        })
      }
    })
    modal.present();
  }
  buscarEnderecoPeloNome(){
    let loading = this.loadingCtrl.create({
      content: 'Carregando...'
    });
    loading.present();
    let request: GeocoderRequest = {
      address: this.logradouro
    }
    let request2: google.maps.GeocoderRequest = {
      address: this.logradouro,
      componentRestrictions: {
        country: 'BR'
      }
    }
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode(request2, (result, status) => {
      
      console.log('result google.maps: ', result);
      console.log('status: ', status);
    })
    this.nativeGeocoder.forwardGeocode(this.logradouro)
      .then(value => {
        console.log('Resultado nativegeocoder: ', value);
        this.nativeGeocoder.reverseGeocode(+value.latitude, +value.longitude)
          .then(value2 => {
            console.log('reverse result: ', value2);
          })
      })
      .catch(err => {
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Ocorreu um erro, tente novamente mais tarde.',
          buttons: [{
            text: 'Ok',
            role: 'cancel'
          }]
        })
        alert.present();
        console.log(err);
      })
      
    this.geocoder.geocode(request)
      .then(result => {
        loading.dismiss();
        console.log('result buscar pelo endereco: ', result)
      })
      
      .catch(err => {
        loading.dismiss();
        let alert = this.alertCtrl.create({
          title: 'Erro',
          subTitle: 'Ocorreu um erro, tente novamente mais tarde.',
          buttons: [{
            text: 'Ok',
            role: 'cancel'
          }]
        })
        alert.present();
        console.log(err);
      })
    
    /*
    this.nativeGeocoder.forwardGeocode(this.logradouro)
      .then(result => {
        console.log(result);
        loading.dismiss();
        this.nativeGeocoder.reverseGeocode(+result.latitude, +result.longitude)
          .then(resultReverse => {
            console.log(resultReverse);
          })
      })
      */
  }
  dismiss(){
    this.navCtrl.pop();
  }

  selectBairro(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Selecione seu bairro');
    this.bairros.map(bairro => {
      alert.addInput({
        type: 'radio',
        label: bairro.nome,
        value: bairro.$key
      });
    })
    alert.addButton('Cancelar');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        this.bairroSelecionado = data;
        console.log(this.bairroSelecionado);
        this.fireService.getBairroByKey(this.bairroSelecionado)
          .subscribe(bairro => {
            console.log(bairro);
            this.bairro = bairro.nome;
          })
      }
    })
    alert.present();
  }

  onSubmitEndereco(){
    let obj = {
      endereco: this.endereco,
      pontoRef: this.pontoRef,
      bairro_nome: this.bairro,
      bairro_key: this.bairroSelecionado
    };
    console.log(obj);
  }

  backButtonAction(){
    this.dismiss();
  }
}
