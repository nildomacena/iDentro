import { LocalizacaoService } from './../../services/localizacao.service';
import { Http } from '@angular/http';
import { MapaPage } from './../mapa/mapa';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AutocompletePage } from './../autocomplete/autocomplete';
import { GoogleMap, GoogleMaps, Geocoder, GeocoderResult, GeocoderRequest, Marker, LatLng } from '@ionic-native/google-maps';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NavController, NavParams, AlertController, LoadingController, ModalController, ToastController, ViewController, Platform, IonicPage } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation'


@IonicPage()
@Component({
  selector: 'page-localizacao',
  templateUrl: 'localizacao.html'
})
export class LocalizacaoPage {
  buscaPelaLocalizacao: boolean;
  buscaPeloCEP: boolean;
  formCep: FormGroup;
  formEndereco: FormGroup;
  bairro: string = '';
  endereco: string = '';
  pontoRef: string = '';
  modal = false;
  loading: boolean = false;
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
  localizado: boolean = false;
  localizacao: any;
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
    public geolocation: Geolocation,
    public locationAccuracy: LocationAccuracy,
    public platform: Platform,
    public http: Http,
    public localizacaoService: LocalizacaoService,
    public formBuilder: FormBuilder


    ) {
      this.formCep = this.formBuilder.group({
        cep: ['', [Validators.required, Validators.pattern('[0-9]{5}[0-9]{3}')]]
      })
      this.formEndereco = this.formBuilder.group({
        endereco: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        referencia: ['', Validators.required],
      })
      this.enderecoAdicional = this.navParams.get('adicional');
      
      this.alert = this.alertCtrl.create({
        title: 'Localização',
        subTitle: 'Escolha a forma de buscar seu endereço',
        buttons: [
          {
            text: 'Buscar pelo CEP',
            handler: () => {
              console.log('Buscar pelo CEP');
              this.buscaPeloCEP = true;
            }
          },
          {
            text: 'Localizar no mapa',
            handler: () => {
              this.buscaPelaLocalizacao = true;
              this.navCtrl.push('MapaPage')
                .then(result => {
                  console.log('resultado dismiss:',result);
                })
            }
          }
        ]
      });
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
    
  }
  ionViewWillLeave() {
    this.localizacaoService.marcador = null;
    this.localizacaoService.cep = '';
  }
  ionViewWillEnter(){
    if(!this.localizacaoService.marcador){ //Se o usuário não selecionou nenhum endereço no mapa, apresenta o alert
      this.alert.present();
    }
    else{
      console.log(this.localizacaoService.marcador);
      this.localizado = true;  //Se o usuário estiver selecionado uma localização no mapa.
      this.getLocationByMarker(this.localizacaoService.marcador)
    }
    this.fireService.getBairros()
      .subscribe(bairros => {
        this.loadingBairros = false;
        this.bairros = bairros;
      })
  }
  criarAlertaSimples(text: string){
    let alert = this.alertCtrl.create({
      title: 'Alerta',
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }
  getLocationByMarker(marker: google.maps.LatLng){
    console.log('get location by marker')
    let geocoder: google.maps.Geocoder = new google.maps.Geocoder(); 
    
    let request: google.maps.GeocoderRequest = {
      location: marker
    };
    let loading = this.loadingCtrl.create({
      content: 'Carregando informações'
    });
    loading.present();
    geocoder.geocode(request, resultGeocode => {
      console.log('resultGeocode: ', resultGeocode);
      let objeto = {
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: ''
      }
      if(resultGeocode[0]){
        this.fullAddress.descricao = resultGeocode[0].formatted_address;
        this.fullAddress.place_id = resultGeocode[0].place_id;
        this.fullAddress.latitude = marker.lat();
        this.fullAddress.longitude = marker.lng();
        resultGeocode[0].address_components.map(component => {
          component.types.map(type => {
            if(type.toLowerCase().includes('route')){
              this.fullAddress.logradouro = component.short_name;
              this.formEndereco.controls['endereco'].setValue(component.short_name);
            }
            else if(type.toLowerCase().includes('sublocality_level_')){
              this.fullAddress.bairro = component.short_name
              this.formEndereco.controls['bairro'].setValue(component.short_name);
            }
            else if(type.toLowerCase().includes('administrative_area_level_2')){
              this.fullAddress.cidade = component.short_name
            }
          })
          console.log('objeto: ',objeto);
        })
        setTimeout(() => {
          loading.dismiss();
          
        }, 500);
      }
      else{
        setTimeout(() => {
          loading.dismiss();
          
        }, 500);
      }
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
        this.geocodificar(request);
      }
    })
    modal.present();
  }
  buscarPeloCep(){
    let endereco: any;
    console.log(this.formCep.controls['cep'].value);
    this.localizacaoService.buscarPeloCEP(this.formCep.controls['cep'].value)
      .subscribe(result => {
        endereco = result.json();
        console.log('result buscar pelo cep: ', endereco)
        if(endereco.erro){
          let alert = this.alertCtrl.create({
            title: 'Erro',
            message: 'Erro ao tentar localizar o endereço. Verifique as informações digitadas e tente novamente.',
            buttons: [{
                text: 'Ok',
                handler: () => {
                  console.log('Ok clicked');
                  this.cep = '';
                }
              }
            ]
          });
          alert.present();
        }
        else{
          let request: google.maps.GeocoderRequest = {
            address: endereco.logradouro,
            componentRestrictions: {
              postalCode: endereco.cep
            }
          };
          this.geocodificar(request);
        }
      })
  }

  geocodificar(request: google.maps.GeocoderRequest){
    console.log('geocodificar');
    let loading = this.loadingCtrl.create({
      content: 'Carregando informações'
    })
    loading.present();

    let geocoder: google.maps.Geocoder = new google.maps.Geocoder();  
      geocoder.geocode(request, (value) => {
        let result = value[0];
        console.log('resultado geocode: ', value);
        if(result){
          this.fullAddress.logradouro = result.address_components[0].short_name;
          this.fullAddress.bairro = result.address_components[1].short_name;
          this.fullAddress.cidade = result.address_components[2].short_name;
          this.fullAddress.latitude = result.geometry.location.lat();
          this.fullAddress.longitude = result.geometry.location.lng();
          let enderecoControl = <FormControl>this.formEndereco.controls['endereco']
          let bairroControl = <FormControl>this.formEndereco.controls['bairro']
          console.log('this.bairroControl: ', bairroControl);
          console.log('this.formcontrolsendereco: ', enderecoControl);
          this.formEndereco.controls['endereco'].setValue(this.fullAddress.logradouro);
          this.formEndereco.controls['bairro'].setValue(this.fullAddress.bairro);

          console.log(result);
          this.endereco = `${result['address_components'][0].short_name}, ${result['address_components'][1].short_name}, ${result['address_components'][2].short_name}`
          console.log('address data = ', this.endereco);
          console.log('geocoder result: ', result);
          this.localizado = true;
          loading.dismiss();
        }
        else{
          loading.dismiss();
          let alert = this.alertCtrl.create({
            title: 'Erro',
            message: 'Erro ao carregar as informações. Tente inserir a localização através do mapa.',
            buttons: [
              {
                text: 'Cancelar',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: 'Ir para o mapa',
                handler: () => {
                  console.log('Mapa clicked');
                  this.navCtrl.push('MapaPage');
                }
              }
            ]
          });
          alert.present();
        }
      });
  }
  salvarEndereco(){
    this.fullAddress.numero = this.numero;
    this.fullAddress.referencia = this.referencia;
    this.fullAddress.descricao = `${this.fullAddress.logradouro}, ${this.fullAddress.numero}. ${this.fullAddress.bairro}`
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

  
  dismiss(){
    this.navCtrl.pop();
  }
  
  onSubmitEndereco(){
    this.fullAddress.numero = this.formEndereco.value.numero;
    this.fullAddress.referencia = this.formEndereco.value.referencia;
    this.fullAddress.descricao = `${this.fullAddress.logradouro}, ${this.fullAddress.numero}. ${this.fullAddress.bairro}`
    this.fireService.salvarEndereco(this.fullAddress)
      .then(_ => {
        let toast = this.toastCtrl.create({
          message: 'Endereço salvo com sucesso',
          duration: 2000
        });
        toast.present();
        this.viewCtrl.dismiss({endereco: this.fullAddress});
      })
    console.log( 'full Address',this.fullAddress);
  }

  backButtonAction(){
    this.dismiss();
  }
}


