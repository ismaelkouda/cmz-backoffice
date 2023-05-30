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

  UpdatePatrimoine(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_PATRIMOINE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
}
