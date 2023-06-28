import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';
import { Observable } from 'rxjs';

// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';

@Injectable({
  providedIn: 'root'
})
export class ProvisionningService {

  public BASE_URL: any = appConfig.serverUrl;


  constructor(
    private http: HttpClient
  ) { }

  GetAllCommandes(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_COMMANDES_SIM);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

  // Ligne Credits
  GetAllLigneCredits(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_LIGNE_CREDIT).replace('{page}', page);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  OnSaveCredit(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_PROVISION_CREDIT);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  OnCancelCredit(data): Observable<any> {
    const url: string = (<string>EndPointUrl.CANCEL_CREDIT);
    return this.http.put(`${this.BASE_URL}${url}`, data);
  }
  OnStatCredit(data): Observable<any> {
    const url: string = (<string>EndPointUrl.STAT_CREDIT);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  //Achats Produits & Services

  GetAllAchats(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_ACHATS).replace('{page}', page);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetAllServices(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_SERVICES);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GenerateNumeroCommande(): Observable<any> {
    const url: string = (<string>EndPointUrl.GENERATE_NUMERO_COMMANDE);
    return this.http.get(`${this.BASE_URL}${url}`);
  }
  CreateProformatCommande(data): Observable<any> {
    const url: string = (<string>EndPointUrl.CREATE_COMMANDE_PROFORMAT);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  OnValidate(id): Observable<any> {
    const url: string = (<string>EndPointUrl.VALIDATE_COMMANDE_PROFORMAT).replace('{id}', id);
    return this.http.get(`${this.BASE_URL}${url}`);
  }
  OnStatAchat(data): Observable<any> {
    const url: string = (<string>EndPointUrl.STAT_ACHAT);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
}
