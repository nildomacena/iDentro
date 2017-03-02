import { lanches, estabelecimentos, lanches_por_estabelecimento } from './dados';
import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AngularFireOffline, ListObservable, ObjectObservable } from 'angularfire2-offline';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class FireService {
    uid = '123456789';
    cart: any[] = [];
    constructor(
        private afo: AngularFireOffline,
        private af: AngularFire
    ) { }

    getEstabelecimentos(){
        return this.af.database.list('estabelecimentos');
    }

    getIngredientes(){
        return this.af.database.list('ingredientes');
    }

    getLanchesPorIngredientes(ingredientes){
        return this.af.database.list('lanches');
    }
    getLanchesPorEstabelecimento(key_estabelecimento: string){
        console.log('key_estb: ',key_estabelecimento)
        return this.af.database.list('lanches_por_estabelecimento/'+key_estabelecimento);
    }

    getLancheByKey(key_lanche: string){
        console.log('key_lanche: ', key_lanche)
        return this.af.database.object('lanches/'+key_lanche);
    }
    getUid(){
        return this.uid;
    }

    addToCart(lanche){
        let adicionado: boolean = false;
        if(this.cart.length == 0){
            this.cart.push({quantidade: 1, lanche: lanche});
            adicionado = true;
            return;
        }

        this.cart.map(item => {
            if(lanche == item.lanche){
                item.quantidade++;
                adicionado = true;
                return;
            }
        })
        if(!adicionado)
            this.cart.push({quantidade: 1, lanche: lanche});
    }

    getCart(){
        return this.cart;
    }
}