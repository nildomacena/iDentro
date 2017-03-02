import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component, ViewChildren, ChangeDetectorRef, ViewChild, QueryList } from '@angular/core';
import { NavController, NavParams, App, Searchbar, Content, AlertController, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-estabelecimentos',
  templateUrl: 'estabelecimentos.html'
})
export class EstabelecimentosPage {
  estabelecimentos: any[];
  showToolbar:boolean = false;
  isSearch: boolean = false;
  isSearchEmpty: boolean = true;
  myInput: string = '';
  isLoading: boolean = true;
  @ViewChildren('searchbar') searchbar: QueryList<Searchbar>;
  @ViewChild(Content) content: Content;

  constructor(
    public navCtrl: NavController,
    public fireService: FireService,
    public app: App,
    public changeDetectionRef: ChangeDetectorRef,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
    ) {
    
  }

  ionViewDidLoad(){

   this.fireService.getEstabelecimentos()
      .subscribe(estabelecimentos => {
        this.isLoading = false;
        this.estabelecimentos = estabelecimentos;
        let toast = this.toastCtrl.create({
          message: '← Deslize para a esquerda para ligar.',
          showCloseButton: true,
          closeButtonText: 'x',
          duration: 3500
        })
        toast.present();
      });
  }

  onSelectEstabelecimento(estabelecimento){
    this.app.getRootNav().push(EstabelecimentoPage,{'estabelecimento': estabelecimento});
  }

  toggleSearchbar(){
    this.showToolbar = !this.showToolbar;
    this.isSearch = !this.isSearch;

    this.searchbar.changes.subscribe( result => {
        this.content.resize();
        let searchbar = <Searchbar>result.toArray()[0];
        if(searchbar){
          searchbar.setFocus();
          this.changeDetectionRef.detectChanges();  
        }
    })
  }

    filter(event: Event){
      let search:string = event.srcElement['value'];
      if(!search)
        this.isSearchEmpty = true;
      else{
        console.log(search);
        /*
        this.isSearchEmpty = search.length > 0? false: true; //Verifica se o usuário digitou alguma coisa no searchbox para que o aplicativo não pesquise com o searchbox vazio
        this.filteredEstabelecimentos = this.estabelecimentos.filter(estabelecimento => estabelecimento.nome.toUpperCase().includes(search.toUpperCase()) || estabelecimento.palavras_chave.toUpperCase().includes(search.toUpperCase()));
        console.log(this.filteredEstabelecimentos);
        console.log('searchbar: ', this.searchbar); */
      }
    } 

    call(estabelecimento){
      let buttons;
      let subTitle;
      
      estabelecimento.celular && estabelecimento.telefone? subTitle = 'Selecione o número para o qual deseja ligar.': 'Deseja realmente ligar?'

      if(estabelecimento.celular && estabelecimento.telefone){
        buttons = [
          {
            text: estabelecimento.telefone,
            handler: () => {console.log(estabelecimento.telefone)}
          },
          {
            text: estabelecimento.celular.numero,
            handler: () => {console.log(estabelecimento.celular.numero)}
          },
          {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      }
      else if(estabelecimento.celular){
          buttons = [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Ligar',
              handler: () => {console.log(estabelecimento.celular)}
            }
          ]
        }

        else if(estabelecimento.telefone){
          buttons = [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Ligar',
              handler: () => {console.log(estabelecimento.celular.numero)}
            }
          ]
        }

        let alert = this.alertCtrl.create({
          title: 'Ligar para '+estabelecimento.nome,
          subTitle: subTitle,
          buttons: buttons
        });
        alert.present();
      }


  }
