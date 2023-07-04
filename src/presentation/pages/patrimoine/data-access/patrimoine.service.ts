import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';

@Injectable({
  providedIn: 'root'
})
export class PatrimoineService {

  public BASE_URL: any = appConfig.serverUrl;

  constructor(
    private http: HttpClient
  ) { }

  GetAllPatrimoine(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PATRIMOINES);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetAllPatrimoines(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PATRIMOINES).replace('{page}', page);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetAllCycles(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_CYCLES).replace('{page}', page);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetAllUsages(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_USAGES);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetAllTransactions(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_TRANSACTIONS).replace('{page}', page);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  OnVerify(data): Observable<any> {
    const url: string = (<string>EndPointUrl.VERIFY_PATRIMOINE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

  UpdatePatrimoine(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_PATRIMOINE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

  OnChangeStatut(data): Observable<any> {
    const url: string = (<string>EndPointUrl.CHANGE_STATUT);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  OnActiver(data): Observable<any> {
    const url: string = (<string>EndPointUrl.ACTIVATION_SIM);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  OnSwaper(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SWAPER_SIM);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  OnVolume(data): Observable<any> {
    const url: string = (<string>EndPointUrl.VOLUME_DATA);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetAllDepartements(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_DEPARTEMENT);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

  GetAllCommunes(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_COMMUNE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
}
