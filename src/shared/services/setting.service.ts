import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { EndPointUrl } from '../enum/api.enum';
import { EncodingDataService } from './encoding-data.service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  public statutSubject = new BehaviorSubject(false);
  public statutSubject$ = this.statutSubject.asObservable();
  public baseUrl: string;
  public httpOptions: any;
  
  constructor(
    private http: HttpClient,
    private storage: EncodingDataService,

  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
  }

  getAllUsers(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_USERS);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnUpdateUser(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_USER);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  getHistoriques(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_HISTORIQUE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  getAllJournal(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_JOURNAL);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  getAllYears(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_YEAR);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  //First Level
  getAllDirectionRegionales(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_FIRSTLEVEL);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllFirstLevelHabilitation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_FIRSTLEVEL_HABILITATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnSaveDirectionRegionale(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_DIRECTION_REGIONALE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnUpdateDirectionRegionale(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_DIRECTION_REGIONALE);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  //Second Level
  getAllExploiatations(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_EXPLOITATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnSaveExploitation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_EXPLOITATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnUpdateEploitation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_EXPLOITATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  // Third Level
  getAllZones(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_NIVEAUX_3);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllThirdLevelHabilitation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_NIVEAUX_3_HABILITATION)
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnSaveZone(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_NIVEAUX_3);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnUpdateZone(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_NIVEAUX_3);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  OnChangeStatutZone(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_STATUT_USAGE);
    return this.http.post(`${this.baseUrl}${url}`, data);
}

  // Security
  HandleUpdatePassword(data): Observable<any> {
    const url: string = (<string>EndPointUrl.HANDLE_UPDATE_PASSWORD);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  getAllSites(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_SITES);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }


}
