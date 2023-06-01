import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';
import { Observable } from 'rxjs';

// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';

@Injectable({
  providedIn: 'root'
})
export class ParametreSecuriteService {

  public BASE_URL: any = appConfig.serverUrl;

  constructor(
    private http: HttpClient

  ) { }

  GetAllProfilHabilitations(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PROFIL_HABILITATIONS);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleSaveProfilHabilitation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_PROFIL_HABILITATION);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleUpdateProfilHabilitation(data, id): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_PROFIL).replace('{id}', id)
    return this.http.put(`${this.BASE_URL}${url}`, data);
  }
  handleleteProfilHabilitation(data, id): Observable<any> {
    const url: string = (<string>EndPointUrl.DELETE_PROFIL_HABILITATION).replace('{id}', id);
    return this.http.delete(`${this.BASE_URL}${url}`, data);
  }
  GetAllUsersWithoutProfil(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_USERS_WITHOUT_PROFIL);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetAllUsersWithProfil(data, id): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_USER_WITH_PROFIL).replace('{id}', id);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleAffectation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_AFFECTATION);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleReaffectation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_REAFFECTATION);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleRetrait(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_RETRAIT);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }

}
