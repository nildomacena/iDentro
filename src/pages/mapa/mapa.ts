import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { GoogleMaps, LatLng, GoogleMap, GoogleMapsEvent, CameraPosition } from '@ionic-native/google-maps';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Alert } from 'ionic-angular';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html'
})
export class MapaPage {
  alertGPS: Alert;
  GPSHabilitado: boolean = false;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    public googleMaps: GoogleMaps,
    public diagnostic: Diagnostic,
    public alertCtrl: AlertController,
    public geolocation: Geolocation
    ) {
      this.alertGPS = this.alertCtrl.create({
        title: 'Localização desativada',
        subTitle: 'O seu sinal de GPS está desabilitado. Aperte Ok para habilitar o sinal',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.diagnostic.switchToLocationSettings();
              console.log('saiu da tela');
            },
          },
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              this.GPSHabilitado = false;
            }
          }
        ]
      });
      this.alertGPS.dismiss()
        .then(() => this.getCurrentPosition());
    }

  ionViewDidLoad() {
    console.log(this.diagnostic.locationMode.LOCATION_OFF);
    this.getCurrentPosition();
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
  setMap(latLng: LatLng){
    let element: HTMLElement = document.getElementById('map');
    let map: GoogleMap = this.googleMaps.create(element,{
      'controls': {
          'compass': true,
          'myLocationButton': true,
          'indoorPicker': true,
          'zoom': true
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
          'zoom': 15,
          'bearing': 50
        }
    });
    let position = {
      target: latLng,
      zoom: 13,
      tilt: 30
    }
    map.one(GoogleMapsEvent.MAP_READY).then(() => {
      console.log('Map is ready!')
      map.moveCamera(position)
        .then(result => {
          console.log('move camera: ',result);
        })
    });

    console.log(latLng);
  }
}
