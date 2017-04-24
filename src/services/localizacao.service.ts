import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';

@Injectable()
export class LocalizacaoService {
    
    public marcador:google.maps.LatLng;
    public cep: string = '';
    constructor(private http: Http) {
         
    }

    buscarPeloCEP(cep: string): Observable<any>{
        return this.http.get(`http://viacep.com.br/ws/${cep}/json/ `);
    }
}