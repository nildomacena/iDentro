import { ChatPage } from './../chat/chat';
import { ConfiguracoesPage } from './../configuracoes/configuracoes';
import { FireService } from './../../services/fire.service';
import { Component, ViewChildren, ChangeDetectorRef, ViewChild, QueryList, ElementRef, Renderer, NgZone } from '@angular/core';
import { NavController, NavParams, App, Searchbar, Content, Navbar, Header, Toolbar, AlertController, ToastController, Platform, ViewController, ModalController, IonicPage, ActionSheetController, Alert, Refresher } from 'ionic-angular';
import { CallNumber } from '@ionic-native/call-number';
@IonicPage()
@Component({
  selector: 'page-home2',
  templateUrl: 'home2.html',
})
export class Home2 {

  filtro = '';
  estabelecimentos: any[] =[];
  filteredEstabelecimentos: any[];
  showToolbar:boolean = false;
  isSearch: boolean = false;
  isSearchEmpty: boolean = true;
  isLoading: boolean = true;
  bairros: any[];
  searchHeight: any;
  newSearchHeight: any;
  filtroBairroEntrega: any[];
  filtroBairroEstabelecimento: any[];
  alertSair: Alert;

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
    public callnumber: CallNumber,
    public actionSheet: ActionSheetController,
    public zone: NgZone
    ) {
      this.searchHeight = 56;
      this.alertSair = this.alertCtrl.create({
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
      });
  }

  ionViewDidLoad(){
    this.filteredEstabelecimentos = this.estabelecimentos = [];
    // descomentar quando a função de redimensionar cabeçalho estiver funcionando
    /*
    this.content.ionScroll.subscribe(ev => {
      this.resizeHeader(ev);
    })
    */

    this.getEstabelecimentos();
  }

  onTabSelect(event){
    console.log(event);
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
  getEstabelecimentos(refresher?:Refresher){
    this.isLoading = true;
    this.fireService.getEstabelecimentos()
      .then(estabelecimentos => {
        this.isLoading = false;
        this.estabelecimentos = this.filteredEstabelecimentos = estabelecimentos;
        console.log(estabelecimentos);
        if(refresher)
          refresher.complete();
      });
      this.fireService.getBairros()
        .subscribe(bairros => {
          this.bairros = bairros;
        })
  }
  openModal(){
    let modal = this.modalCtrl.create(ConfiguracoesPage, {bairros: this.bairros});
    modal.present();
    modal.onDidDismiss(data => {
      console.log('dismiss modal: ', data);
      if(data){
        this.filtroBairroEntrega = data.bairrosEntrega;
        this.filtroBairroEstabelecimento = data.bairrosEstabelecimentos;
        this.filtrarPorBairro(); 
      }
      else{
        this.filteredEstabelecimentos = this.estabelecimentos;
      }
    })
  }
  exitApp(){
    console.log('Exit app');
    this.platform.exitApp();
  }

  onSelectEstabelecimento(estabelecimento){
    this.app.getRootNav().push('EstabelecimentoPage',{'estabelecimento': estabelecimento});
  }

  toggleSearchbar(){
    if(this.isSearch)
      this.filteredEstabelecimentos = this.estabelecimentos;
    this.showToolbar = !this.showToolbar;
    this.isSearch = !this.isSearch;

    this.searchbar.changes.subscribe( result => {
        this.content.resize();
        console.log('content resize toggle searchbar');
        let searchbar = <Searchbar>result.toArray()[0];
        if(searchbar){
          //searchbar.setFocus();
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
      this.filtro = search;
      this.isSearchEmpty = true;
      this.filteredEstabelecimentos = this.estabelecimentos;
    }
    else{
      console.log('search: ', search);

      this.isSearchEmpty = true;//search.length > 0? false: true; //Verifica se o usuário digitou alguma coisa no searchbox para que o aplicativo não pesquise com o searchbox vazio
      this.filteredEstabelecimentos = this.estabelecimentos.filter(estabelecimento => 
        estabelecimento.nome.toUpperCase().includes(search.toUpperCase()));

      console.log(this.filteredEstabelecimentos);
      console.log('searchbar: ', this.searchbar);
    }
  } 

  filtrarPorBairro(bairrosEntrega?: any[], bairrosEstabelecimento?: any[]){
    this.filteredEstabelecimentos = [];
    if(this.filtroBairroEstabelecimento){
      try{
        this.estabelecimentos.map((estabelecimento, index) => {
          let achou = false;
          console.log(estabelecimento);
          this.filtroBairroEstabelecimento.map(bairro => {
            if(estabelecimento.bairro_key)
              if(estabelecimento.bairro_key.includes(bairro))
                this.filteredEstabelecimentos.push(estabelecimento);
          })
        })  
      }
      catch (err){
        console.error(err);
      }
      console.log('filtered estabelecimentos: ', this.filteredEstabelecimentos);
    }
  }

  limparFiltros(){
    this.zone.run(() => {
      this.filteredEstabelecimentos = this.estabelecimentos;
    })
  }

  openChat(estabelecimento){
    console.log(estabelecimento);
    let chatModal = this.modalCtrl.create('ChatPage', {estabelecimento: estabelecimento});
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
              this.callnumber.callNumber(estabelecimento.telefone1.numero.replace(/[^\d]/g, ''), true)
            }
          },
          {
            text: estabelecimento.telefone2.numero,
            handler: () => {
              this.callnumber.callNumber(estabelecimento.telefone2.numero.replace(/[^\d]/g, ''), true)
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
                this.callnumber.callNumber(estabelecimento.telefone2.replace(/[^\d]/g, ''), true)
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
                this.callnumber.callNumber(estabelecimento.telefone2.numero.replace(/[^\d]/g, ''), true)
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
  
  opcoes(estabelecimento){
    let action = this.actionSheet.create({
      title: 'Opções',
      buttons: [
        {
        text: `Abrir chat com ${estabelecimento.nome}`,
        role: 'destructive',
        icon: 'text',
        handler: () => {
            this.openChat(estabelecimento);
          }
        }
      ]
    })
    if(estabelecimento.telefone1 || estabelecimento.telefone2){
      action.addButton({
        text: `Ligar para ${estabelecimento.nome}`,
        role: 'destructive',
        icon: 'call',
        handler: () => {
            this.call(estabelecimento);
          }
        })
    }
    action.present();
  }
}

