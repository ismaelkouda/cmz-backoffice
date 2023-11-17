import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';
import { Observable } from 'rxjs';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

@Injectable({
  providedIn: 'root'
})
export class ParametreSecuriteService {

  public baseUrl: string;

  constructor(
    private http: HttpClient,
    private storage: EncodingDataService,
  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
  }

  GetAllProfilHabilitations(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PROFIL_HABILITATIONS);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleSaveProfilHabilitation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_PROFIL_HABILITATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleUpdateProfilHabilitation(data, id): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_PROFIL).replace('{id}', id)
    return this.http.put(`${this.baseUrl}${url}`, data);
  }
  handleleteProfilHabilitation(data, id): Observable<any> {
    const url: string = (<string>EndPointUrl.DELETE_PROFIL_HABILITATION).replace('{id}', id);
    return this.http.delete(`${this.baseUrl}${url}`, data);
  }
  GetAllUsersWithoutProfil(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_USERS_WITHOUT_PROFIL);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  GetAllUsersWithProfil(data, id): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_USER_WITH_PROFIL).replace('{id}', id);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleAffectation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_AFFECTATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleReaffectation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_REAFFECTATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleRetrait(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_RETRAIT);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  handleActivateProfil(data): Observable<any> {
    const url: string = (<string>EndPointUrl.ACTIVATE_PROFIL).replace('{id}', data)
    return this.http.put(`${this.baseUrl}${url}`, {});
  }
  handleDisableProfil(data): Observable<any> {
    const url: string = (<string>EndPointUrl.DISABLE_PROFIL).replace('{id}', data)
    return this.http.put(`${this.baseUrl}${url}`, {});
  }


}
