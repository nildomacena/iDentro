import { AutocompletePage } from './../autocomplete/autocomplete';
import { GoogleMap, GoogleMaps, Geocoder, GeocoderResult, GeocoderRequest } from '@ionic-native/google-maps';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController, ToastController, ViewController } from 'ionic-angular';
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
  referencia: string = '';
  geocoder: Geocoder = new Geocoder();
  fullAddress: any;
  enderecoAdicional: boolean = false;  //Serve para verificar se o usuário deseja adicionar mais um endereço à sua lista ou se quer um endereço exporádico

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController,
    public navParams: NavParams,
    public fireService: FireService,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public nativeGeocoder: NativeGeocoder,
    public loadingCtrl: LoadingController,
    public googleMaps: GoogleMaps,

    ) {
      this.enderecoAdicional = this.navParams.get('adicional');
      this.alert = this.alertCtrl.create();
      this.fullAddress = {
        logradouro: '',
        numero: '',
        referencia: '',
        descricao: '',
        latitude: '',
        longitude: '',
        place_id: '',
        bairro: '',
        cidade: ''
      }
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

  showAddressModal(){
    console.log('show address modal');
    let modal = this.modalCtrl.create(AutocompletePage,{data: this.endereco});
    modal.onDidDismiss(data => {
      if(data){
        this.fullAddress.place_id = data.place_id;

        let request: google.maps.GeocoderRequest = {
          placeId: data.place_id
        };
        let geocoder: google.maps.Geocoder = new google.maps.Geocoder();
        geocoder.geocode(request, (value) => {
          let result = value[0];
          this.fullAddress.descricao = result.formatted_address;
          this.fullAddress.logradouro = result.address_components[0].short_name;
          this.fullAddress.bairro = result.address_components[1].short_name;
          this.fullAddress.cidade = result.address_components[2].short_name;
          this.fullAddress.latitude = result.geometry.location.lat();
          this.fullAddress.longitude = result.geometry.location.lng();

          console.log(result);
          this.endereco = `${result['address_components'][0].short_name}, ${result['address_components'][1].short_name}, ${result['address_components'][2].short_name}`
          console.log('address data = ', this.endereco);
          console.log('geocoder result: ', result);
        })
      }
    })
    modal.present();
  }

  salvarEndereco(){
    this.fullAddress.numero = this.numero;
    this.fullAddress.referencia = this.referencia;
    if(this.enderecoAdicional){
      this.viewCtrl.dismiss({endereco: this.fullAddress});
    }
    else{
      this.fireService.salvarEndereco(this.fullAddress)
        .then(_ => {
          let toast = this.toastCtrl.create({
            message: 'Endereco salvo',
            duration: 2500
          })
          toast.present();
          this.dismiss();
        })
    }
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
