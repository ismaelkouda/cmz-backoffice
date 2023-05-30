import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';
@Injectable({
  providedIn: 'root'
})
export class InterconnexionService {

  public BASE_URL: any = appConfig.serverUrl;

  constructor(
    private http: HttpClient
  ) { }

  GetAllConnexions(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_CONNEXION);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
}
