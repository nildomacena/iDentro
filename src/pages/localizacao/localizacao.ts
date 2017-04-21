import { MapaPage } from './../mapa/mapa';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { AutocompletePage } from './../autocomplete/autocomplete';
import { GoogleMap, GoogleMaps, Geocoder, GeocoderResult, GeocoderRequest, Marker, LatLng } from '@ionic-native/google-maps';
import { FireService } from './../../services/fire.service';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController, ToastController, ViewController, Platform, IonicPage } from 'ionic-angular';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation'


@IonicPage()
@Component({
  selector: 'page-localizacao',
  templateUrl: 'localizacao.html'
})
export class LocalizacaoPage {
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
    public platform: Platform


    ) {
      this.localizacao = {

      }

      this.enderecoAdicional = this.navParams.get('adicional');
      this.alert = this.alertCtrl.create({
        title: 'Localização',
        subTitle: 'Escolha a forma de buscar seu endereço',
        buttons: [
          {
            text: 'Buscar pelo CEP',
            handler: () => {
              console.log('Buscar pelo CEP');
            }
          },
          {
            text: 'Localizar no mapa',
            handler: () => {
              this.navCtrl.push('MapaPage')
                .then(result => {
                  console.log('resultado dismiss:',result);
                })
            }
          },
          {
          text: 'Buscar pela localização',
          handler: () => {
              console.log('Buscar pela localização');
              this.getLocation();
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
    this.fireService.marcador = null;
  }
  ionViewWillEnter(){
    if(!this.fireService.marcador){
      this.alert.present();
    }
    else{
      this.localizado = true;  //Se o usuário estiver selecionado uma localização no mapa.
      this.getLocationByMarker(this.fireService.marcador)
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
              this.fullAddress.logradouro = component.short_name
            }
            else if(type.toLowerCase().includes('sublocality_level_')){
              this.fullAddress.bairro = component.short_name
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

  getLocation(){
    if(this.platform.is('cordova')){
      this.locationAccuracy.canRequest()
        .then(result => {
          if(result){
            let loading = this.loadingCtrl.create({
              content: 'Carregando localização'
            });
            loading.present();
            
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY)
              .then(value => {
                console.log(value);
                this.geolocation.getCurrentPosition()
                  .then(data => {
                    this.nativeGeocoder.reverseGeocode(data.coords.latitude, data.coords.longitude)
                      .then(value => {
                        loading.dismiss();
                        this.navCtrl.push('MapaPage', {position: data.coords})
                        /*
                        let mapModal = this.modalCtrl.create(MapaPage,{position: data.coords});
                        mapModal.present();*/
                        console.log(value);
                      })
                      .catch(err => {
                        loading.dismiss();
                        console.error(err);
                      })
                    console.log('geolocation: ', data);
                  })
                  .catch(err => {
                    loading.dismiss();
                    this.criarAlertaSimples('Ocorreu um erro ao gerar localização');
                    console.error(err);
                  });
              })
              .catch(err => {
                loading.dismiss();
                this.criarAlertaSimples('É necessário permitir acesso à localização');
                console.log(err)
              })
          }
        })
    }
    else{
      console.log('Não é cordova');
      this.geolocation.getCurrentPosition()
        .then(resultGeolocation => {
          console.log('result Geolocation', resultGeolocation);
          let latLng = new google.maps.LatLng(resultGeolocation.coords.latitude,resultGeolocation.coords.longitude)
          new google.maps.Geocoder().geocode({location: latLng}, 
            resultGeocoder => {
              console.log('resultGeocoder: ', resultGeocoder);
            })
        })
    }
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

  buscarPeloCep(){
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: this.cep+'maceió alagoas santa lúcia'},
    result => {
      console.log('Result pelo cep', result);
    })
  }

  onSubmitEndereco(){
    this.fireService.salvarEndereco(this.fullAddress)
      .then(_ => {
        let toast = this.toastCtrl.create({
          message: 'Endereço salvo com sucesso',
          duration: 2000
        });
        toast.present();
        this.viewCtrl.dismiss();
      })
    console.log( 'full Address',this.fullAddress);
  }

  backButtonAction(){
    this.dismiss();
  }
}
