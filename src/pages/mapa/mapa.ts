import { LocalizacaoService } from './../../services/localizacao.service';
import { FireService } from './../../services/fire.service';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { GoogleMaps, LatLng, GoogleMap, GoogleMapsEvent, CameraPosition, MarkerOptions, Marker, GeocoderRequest } from '@ionic-native/google-maps';
import { Component, ViewChild, ViewChildren } from '@angular/core';
import { NavController, NavParams, AlertController, Alert, ViewController, TextInput, Platform, IonicPage, LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage {
  alertGPS: Alert;
  GPSHabilitado: boolean = false;
  coords: any;
  loading: any;
  marcadorAdicionado: boolean = false;
  marcador: LatLng;
  markers: google.maps.Marker[] = [];
  map: google.maps.Map;
  autocompleteSearchbox: HTMLInputElement;
  autocomplete: google.maps.places.Autocomplete;
  latLngMaceio: google.maps.LatLng; // latitude e longitude de maceió pra delimitar uma área menor de buscar no autocomplete
  @ViewChild('search') autocompleteInput: TextInput;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public googleMaps: GoogleMaps,
    public diagnostic: Diagnostic,
    public alertCtrl: AlertController,
    public geolocation: Geolocation,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public locationAccuracy: LocationAccuracy,
    public platform: Platform,
    public fireService: FireService,
    public localizacaoService: LocalizacaoService
    ) {
      this.coords = this.navParams.get('position');
      this.localizacaoService.marcador = null;
      this.loading = this.loadingCtrl.create({
        content: 'Carregando localização'
      });

    }

  ionViewDidLoad() {
    this.autocompleteSearchbox = <HTMLInputElement>document.getElementById('search');
    let autocompleteOptions: google.maps.places.AutocompleteOptions = {
      types: ['address'],
      componentRestrictions: {
        country: 'BR'
      },
    }
    let geocoder = new google.maps.Geocoder();
    let geocoderRequest: google.maps.GeocoderRequest = {
      address: 'maceió',
      componentRestrictions: {
        administrativeArea: 'maceió alagoas',

      }
    }
    geocoder.geocode(geocoderRequest, result => {
      this.latLngMaceio = result[0].geometry.location;
      let radius: number = 1000;
      /*
      let targetNorthEast:google.maps.LatLng = google.maps.geometry.spherical.computeOffset(this.latLngMaceio, radius * Math.sqrt(2), 45);
      let targetSouthWest:google.maps.LatLng = google.maps.geometry.spherical.computeOffset(this.latLngMaceio, radius * Math.sqrt(2), 225);
      */    
      let targetNorthEast = new google.maps.LatLng(-9.714525,-35.797325);
      let targetSouthWest = new google.maps.LatLng(-9.429315,-35.782216);
      let lngLatBounds = new google.maps.LatLngBounds(targetSouthWest,targetNorthEast);
      console.log('Nordeste: ', targetNorthEast.toString());
      console.log('Sudoeste: ', targetSouthWest.toString())
      this.autocomplete.setBounds(lngLatBounds);
    })
    this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteSearchbox, autocompleteOptions);
    this.autocomplete.addListener('place_changed', () => {
      let latLng = this.autocomplete.getPlace().geometry.location;
      this.setMapJavascript(latLng);
      this.addMarkerJavascript(this.map,latLng);
    })
    if(this.coords){
      this.setMap(new LatLng(this.coords.latitude, this.coords.longitude));
    }
    else{
      this.getCurrentPosition();
    }
  }

  ionViewWillLeave(){
    this.loading.dismiss();
  }
  clearAutocomplete(){
    this.autocompleteSearchbox.value = '';
  }
  checkLocation(){
    this.diagnostic.isGpsLocationEnabled()
      .then(result => {
        console.log('checklocation: ', result);
        if(!result){
          this.alertGPS.present();
        }
        else{
          this.getCurrentPosition();
        }

      })
  } 

  getCurrentPosition(){
    if(this.platform.is('cordova')){
      this.locationAccuracy.canRequest()
        .then(canRequest => {
        if(canRequest){
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_LOW_POWER)
              .then(resultRequest => {
                console.log('resultRequest: ', resultRequest);
                this.loading.present();
                this.geolocation.getCurrentPosition({
                  enableHighAccuracy: false,
                  maximumAge: Infinity,
                  timeout: 20000
                })
                  .then(resultPosition => {
                    console.log('result Position: ',resultPosition);
                    this.loading.dismiss();
                    this.setMapJavascript(new LatLng(resultPosition.coords.latitude, resultPosition.coords.longitude));
                  })
                  .catch(errPosition => {
                    this.loading.dismiss();
                    console.log('Error Position: ', errPosition);
                  })
              })
              .catch(errRequest => {
                console.error(errRequest);
              })
        }
      })
    }
    else{
      this.loading.present();
      this.geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        maximumAge: Infinity,
        timeout: 15000
      })
        .then(result => {
          this.loading.dismiss();
          this.setMapJavascript(new LatLng(result.coords.latitude, result.coords.longitude));
        })
        .catch(err => {
          this.loading.dismiss();
          console.error(err);
        })

    }
    /*
    if(this.platform.is('cordova')){
      this.diagnostic.isGpsLocationEnabled()  
        .then(result => {
          if(!result){
            this.alertGPS.present();
          }
          else{
            this.geolocation.getCurrentPosition()
              .then(result => {
                this.GPSHabilitado = true;
                let latLng: LatLng = new LatLng(result.coords.latitude, result.coords.longitude);
                this.setMap(latLng);
              })
              .catch(err => {
                console.log(err);
              })
          }
        })
    }
    else{
      this.geolocation.getCurrentPosition()
        .then(result => {
          this.setMap(new LatLng(result.coords.latitude, result.coords.longitude));
        })
    }
    
    /*this.diagnostic.isGpsLocationEnabled()
      .then(result => {
        if(!result)
          this.checkLocation();
        else{
          this.geolocation.getCurrentPosition(result => {
            let latLng: LatLng = new LatLng(result.coords.latitude, result.coords.latitude)
            this.setMap(latLng);
          })
        }
      })*/
  }
  setMapJavascript(latLng: LatLng|google.maps.LatLng){
    let element: HTMLElement = document.getElementById('map');
    let mapOptions: google.maps.MapOptions = {
      center: latLng,
      zoom: 18,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: false,
      mapTypeControl: false
    }
    this.map = new google.maps.Map(element, mapOptions);
    
    this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(this.autocompleteSearchbox);
    
    
    this.map.addListener('click', (resultClick) => {
      let markerLatLng = new google.maps.LatLng(resultClick.latLng.lat(),resultClick.latLng.lng());
      this.addMarkerJavascript(this.map,markerLatLng)
    })
  }

  setMap(latLng: LatLng){
    let element: HTMLElement = document.getElementById('map');
    let map: GoogleMap = this.googleMaps.create(element,{
      'controls': {
          'compass': true,
          'myLocationButton': true,
          'indoorPicker': false
        },
        'gestures': {
          'scroll': true,
          'tilt': true,
          'rotate': true,
          'zoom': true
        },
        'camera': {
          'latLng': latLng,
          'tilt': 30,
          'zoom': 18,
          'bearing': 50
        }
    });

    let position = {
      target: latLng,
      zoom: 18,
      tilt: 30
    }
    map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready!')
      map.moveCamera(position)
        .then(result => {
          console.log('move camera: ',result);
        })
    });
    map.addEventListener(GoogleMapsEvent.MAP_CLICK)
      .subscribe(result => {
        console.log(result);
        this.addMarker(map, result);
      })
    console.log(latLng);
  }

  addMarker(map: GoogleMap,latLng: LatLng){
    let markerOptions: MarkerOptions = {
      position: latLng
    }
    map.clear();
    map.addMarker(markerOptions)
      .then(marker => {
        this.marcadorAdicionado = true;
        this.marcador = latLng;
      })
  }

  addMarkerJavascript(map: google.maps.Map, latLng: google.maps.LatLng){
    let markerOptions: google.maps.MarkerOptions = {
      position: latLng,
      map: map
    }
    if(this.markers[0]){
      this.markers[0].setMap(null);
      this.markers = [];
    }
    this.markers.push(new google.maps.Marker(markerOptions));
    this.marcadorAdicionado = true;

    
  }

  selecionaEndereco(){
    console.log('marcador: ', this.markers[0].getPosition())
    this.localizacaoService.marcador = this.markers[0].getPosition();
    this.dismiss();
  }

  dismiss(){
    this.viewCtrl.dismiss({marcador: this.markers[0].getPosition()});
  }
}
