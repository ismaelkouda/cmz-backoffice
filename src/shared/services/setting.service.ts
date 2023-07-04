import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

// @ts-ignore
import appConfig from '../../assets/config/app-config.json';
import { EndPointUrl } from '../enum/api.enum';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  public statutSubject = new BehaviorSubject(false);
  public statutSubject$ = this.statutSubject.asObservable();

  public BASE_URL: any = appConfig.serverUrl;
  public httpOptions: any;
  constructor(
    private http: HttpClient,
  ) { }

  getAllUsers(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_USERS);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  getHistoriques(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_HISTORIQUE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  getAllYears(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_YEAR);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  getAllDirectionRegionales(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_DIRECTION_REGIONALE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  getAllExploiatations(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_EXPLOITATION);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  getAllZones(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_NIVEAUX_3);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

}
