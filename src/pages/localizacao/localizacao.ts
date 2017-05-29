import { LocalizacaoService } from './../../services/localizacao.service';
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
  buscaPelaLocalizacao: boolean; //Indica se a busca será pela geolocalizacao
  buscaPeloCEP: boolean; //Indica se a busca será pelo CEP
  formCep: FormGroup; // Formulário do CEP
  formEndereco: FormGroup; //Formulário do endereço já depois da busca (pelo CEP ou pelo mapa)
  alert: any; //Alerta inicial
  geocoder: Geocoder = new Geocoder();  //Geocoder que obtem localizacao
  fullAddress: any;  //Endereco completo após a geocodificação
  localizado: boolean = false; //Indica se o endereço foi localizado ou não
  enderecoAdicional: boolean = false;  //Serve para verificar se o usuário deseja adicionar mais um endereço à sua lista ou se quer um endereço exporádico
  salvarAdicional: boolean = false;

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
    public localizacaoService: LocalizacaoService,
    public formBuilder: FormBuilder


    ) {
      this.formCep = this.formBuilder.group({
        cep: ['', [Validators.required, Validators.pattern('[0-9]{5}[0-9]{3}')]]
      })
      this.formEndereco = this.formBuilder.group({
        logradouro: ['', Validators.required],
        numero: ['', Validators.required],
        bairro: ['', Validators.required],
        referencia: ['', Validators.required],
        cidade: '',
        estado: '',
        complemento: '',
        descricao: ''
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
              this.navCtrl.push('MapaPage');
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
      if(this.enderecoAdicional){
        // Import the AlertController from ionic package 
        // Consume it in the constructor as 'alertCtrl' 
        let alert = this.alertCtrl.create({
          title: 'Confirmação',
          message: 'Deseja salvar esse endereço em seu cadastro?',
          buttons: [
            {
            text: 'Não', role: 'cancel',
            handler: () => {
              this.alert.present();
            }
            }, {
              text: 'Sim',
              handler: () => {
                this.salvarAdicional = true;
                this.alert.present();
              }
            }
          ]
        });
        alert.present();
      }
      else{
        this.alert.present();

      }
    }
    else{
      console.log(this.localizacaoService.marcador);
      this.localizado = true;  //Se o usuário estiver selecionado uma localização no mapa.
      this.getLocationByMarker(this.localizacaoService.marcador)
    }
  }
  
  getLocationByMarker(marker: google.maps.LatLng){
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
              this.formEndereco.controls['logradouro'].setValue(component.short_name);
            }
            else if(type.toLowerCase().includes('sublocality_level_')){
              this.fullAddress.bairro = component.short_name
              this.formEndereco.controls['bairro'].setValue(component.short_name);
            }
            else if(type.toLowerCase().includes('administrative_area_level_1')){
              this.fullAddress.cidade = component.short_name
              this.formEndereco.controls['estado'].setValue(component.short_name);
            }
            else if(type.toLowerCase().includes('administrative_area_level_2')){
              this.fullAddress.cidade = component.short_name
              this.formEndereco.controls['cidade'].setValue(component.short_name);
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


  buscarPeloCep(){
    let endereco: any;
    let loading = this.loadingCtrl.create({
      content: 'Carregando localização'
    });
    loading.present();
    this.localizacaoService.buscarPeloCEP(this.formCep.controls['cep'].value)
      .subscribe(result => {
        loading.dismiss();
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
                  this.formCep.controls['cep'].reset();
                }
              }
            ]
          });
          alert.present();
        }
        else{
          this.formEndereco.controls['logradouro'].setValue(endereco.logradouro)
          this.formEndereco.controls['bairro'].setValue(endereco.bairro)
          this.formEndereco.controls['cidade'].setValue(endereco.localidade)
          this.formEndereco.controls['estado'].setValue(endereco.uf)
          this.localizado = true;
          let request: google.maps.GeocoderRequest = {
            address: endereco.logradouro,
            componentRestrictions: {
              postalCode: endereco.cep
            }
          };
          //this.geocodificar(request);
        }
      })
  }
  
  dismiss(){
    this.navCtrl.pop();
  }
  
  onSubmitEndereco(){
    this.formEndereco.controls['descricao'].setValue(`${this.formEndereco.value.logradouro}, ${this.formEndereco.value.numero}, ${this.formEndereco.value.bairro}. ${this.formEndereco.value.cidade}`)
    console.log('form endereço:',this.formEndereco.value);
    this.fullAddress.numero = this.formEndereco.value.numero;
    this.fullAddress.referencia = this.formEndereco.value.referencia;
    this.fullAddress.descricao = `${this.fullAddress.logradouro}, ${this.fullAddress.numero}. ${this.fullAddress.bairro}`
    if(this.enderecoAdicional && !this.salvarAdicional)
        this.viewCtrl.dismiss({endereco: this.formEndereco.value});
      else{
        this.fireService.salvarEndereco(this.formEndereco.value)
          .then(_ => {
            let toast = this.toastCtrl.create({
              message: 'Endereço salvo com sucesso',
              duration: 2000
            });
            toast.present();
            this.viewCtrl.dismiss({endereco:this.formEndereco.value});
          })
      }
  }

  backButtonAction(){
    this.dismiss();
  }
}




/*
  L I M B O

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
          let enderecoControl = <FormControl>this.formEndereco.controls['logradouro']
          let bairroControl = <FormControl>this.formEndereco.controls['bairro']
          console.log('this.bairroControl: ', bairroControl);
          console.log('this.formcontrolsendereco: ', enderecoControl);
          this.formEndereco.controls['logradouro'].setValue(this.fullAddress.logradouro);
          this.formEndereco.controls['bairro'].setValue(this.fullAddress.bairro);

          console.log(result);
          //this.endereco = `${result['address_components'][0].short_name}, ${result['address_components'][1].short_name}, ${result['address_components'][2].short_name}`
          //console.log('address data = ', this.endereco);
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
 */