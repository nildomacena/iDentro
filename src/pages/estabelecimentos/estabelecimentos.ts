import { ChatPage } from './../chat/chat';
import { ConfiguracoesPage } from './../configuracoes/configuracoes';
import { EstabelecimentoPage } from './../estabelecimento/estabelecimento';
import { FireService } from './../../services/fire.service';
import { Component, ViewChildren, ChangeDetectorRef, ViewChild, QueryList, ElementRef, Renderer } from '@angular/core';
import { NavController, NavParams, App, Searchbar, Content, Navbar, Header, Toolbar, AlertController, ToastController, Platform, ViewController, ModalController } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-estabelecimentos',
  templateUrl: 'estabelecimentos.html'
})
export class EstabelecimentosPage {
  estabelecimentos: any[];
  filteredEstabelecimentos: any[];
  showToolbar:boolean = false;
  isSearch: boolean = false;
  isSearchEmpty: boolean = true;
  myInput: string = '';
  isLoading: boolean = true;
  bairros: any[];
  searchHeight: any;
  newSearchHeight: any;
  filtroBairroEntrega: any[];
  filtroBairroEstabelecimento: any[];

  @ViewChildren('searchbar') searchbar: QueryList<Searchbar>;
  @ViewChild(Content) content: Content;
  @ViewChild(Header) header: Header;
  @ViewChild(Navbar) navbar: Navbar;
  @ViewChild(Toolbar) toolbar: Toolbar;

  @ViewChild(Searchbar) searchbarElement: Searchbar;

  constructor(
    public navCtrl: NavController,
    public fireService: FireService,
    public app: App,
    public changeDetectionRef: ChangeDetectorRef,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public platform: Platform,
    public viewCtrl: ViewController,
    public elementRef: ElementRef,
    public renderer: Renderer,
    public modalCtrl: ModalController,
    public callnumber: CallNumber
    ) {
      this.searchHeight = 56;
  }

  ionViewDidLoad(){
    // descomentar quando a função de redimensionar cabeçalho estiver funcionando
    /*
    this.content.ionScroll.subscribe(ev => {
      this.resizeHeader(ev);
    })
    */
    this.fireService.getEstabelecimentos()
      .subscribe(estabelecimentos => {
        this.isLoading = false;
        this.estabelecimentos = this.filteredEstabelecimentos = estabelecimentos;
        let toast = this.toastCtrl.create({
          message: '← Deslize para a esquerda para ligar.',
          showCloseButton: true,
          closeButtonText: 'x',
          duration: 4500
        })
        toast.present();
      });
      this.fireService.getBairros()
        .subscribe(bairros => {
          this.bairros = bairros;
        })
  }

  backButtonAction(){
    if(this.isSearch){
      this.toggleSearchbar();
    }
    else{
      let alert = this.alertCtrl.create({
        title: 'Deseja sair?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: 'Sair',
            handler: () => {
              this.exitApp();
            }
          }
        ]
      })
      alert.present();
    }  
  }

  openModal(){
    let modal = this.modalCtrl.create(ConfiguracoesPage,{bairros: this.bairros});
    modal.present();
    modal.onDidDismiss(data => {
      if(data){
        this.filtroBairroEntrega = data.bairrosEntrega;
        this.filtroBairroEstabelecimento = data.bairrosEstabelecimentos;
      }
    })
  }
  exitApp(){
    console.log('Exit app');
    this.platform.exitApp();
  }

  onSelectEstabelecimento(estabelecimento){
    this.app.getRootNav().push(EstabelecimentoPage,{'estabelecimento': estabelecimento});
  }

  toggleSearchbar(){
    this.showToolbar = !this.showToolbar;
    this.isSearch = !this.isSearch;

    this.searchbar.changes.subscribe( result => {
        this.content.resize();
        console.log('content resize toggle searchbar');
        let searchbar = <Searchbar>result.toArray()[0];
        if(searchbar){
          searchbar.setFocus();
          this.changeDetectionRef.detectChanges();  
        }
    })
  }


  //Função para redimensionar Header. Ainda não está funcionando
  resizeHeader(ev){
    console.log(this.content.scrollTop);
    ev.domWrite(()=> {
      this.newSearchHeight = this.searchHeight - ev.scrollTop;
      if(this.newSearchHeight < 0 )
        this.newSearchHeight = 0;
    })
    console.log('new search height', this.newSearchHeight);
    this.renderer.setElementStyle(this.header.getElementRef().nativeElement, 'height', this.newSearchHeight+'px');
    this.renderer.setElementStyle(this.navbar.getElementRef().nativeElement, 'height', this.newSearchHeight+'px');
    if(this.toolbar)
      this.renderer.setElementStyle(this.toolbar.getElementRef().nativeElement, 'height', this.newSearchHeight+'px');
    if(this.searchbarElement)
      this.renderer.setElementStyle(this.searchbarElement.getElementRef().nativeElement, 'height', this.newSearchHeight+'px');

  }
  filter(event: Event){
    let search:string = event.srcElement['value'];
    if(!search){
      this.isSearchEmpty = true;
      this.filteredEstabelecimentos = this.estabelecimentos;
    }
    else{
      console.log('search: ', search);

      this.isSearchEmpty = search.length > 0? false: true; //Verifica se o usuário digitou alguma coisa no searchbox para que o aplicativo não pesquise com o searchbox vazio
      this.filteredEstabelecimentos = this.estabelecimentos.filter(estabelecimento => 
        estabelecimento.nome.toUpperCase().includes(search.toUpperCase()));

      console.log(this.filteredEstabelecimentos);
      console.log('searchbar: ', this.searchbar);
    }
  } 
  openChat(estabelecimento){
    console.log(estabelecimento);
    let chatModal = this.modalCtrl.create(ChatPage, {estabelecimento: estabelecimento});
    chatModal.present();
  }
  call(estabelecimento){
      let buttons;
      let subTitle;
      
      estabelecimento.telefone2 && estabelecimento.telefone1? subTitle = 'Selecione o número para o qual deseja ligar.': 'Deseja realmente ligar?'

      if(estabelecimento.telefone1 && estabelecimento.telefone1){
        buttons = [
          {
            text: estabelecimento.telefone1.numero,
            handler: () => {
              this.callnumber.callNumber(estabelecimento.telefone1.numero, true)
            }
          },
          {
            text: estabelecimento.telefone2.numero,
            handler: () => {
              this.callnumber.callNumber(estabelecimento.telefone2.numero, true)
            }
          },
          {
            text: 'Cancelar',
            role: 'cancel'
          }
        ]
      }
      else if(estabelecimento.telefone2){
          buttons = [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Ligar',
              handler: () => {
                this.callnumber.callNumber(estabelecimento.telefone2, true)
              }
            }
          ]
        }

        else if(estabelecimento.telefone1){
          buttons = [
            {
              text: 'Cancelar',
              role: 'cancel'
            },
            {
              text: 'Ligar',
              handler: () => {
                this.callnumber.callNumber(estabelecimento.telefone2.numero, true)
              }
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

      funnel(){
        if(this.bairros){
          let alert = this.alertCtrl.create();
          alert.setTitle('Escolha o seu bairro');
          alert.addButton({
            text: 'Cancelar',
            role: 'cancel'
          });
          alert.addButton({
            text: 'OK',
            handler: data =>{
              console.log(data);
            }
          })
          this.bairros.map(bairro => {
            alert.addInput({
              type: 'radio',
              label: bairro.nome,
              value: bairro
            })
          })
        alert.present();
        }
      }
  

}

