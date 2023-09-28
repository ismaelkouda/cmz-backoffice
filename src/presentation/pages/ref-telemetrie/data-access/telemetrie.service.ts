import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';
import { Observable } from 'rxjs';

// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';

@Injectable({
  providedIn: 'root'
})
export class TelemetrieService {

  public BASE_URL: any = appConfig.serverUrl;

  constructor(
    private http: HttpClient,
  ) { }

  GetAllReferentielTelemetrie(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_REFERENTIEL_TELEMETRIE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetMetriquesByProfil(id): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_METRIQUES_BY_PROFIL).replace('{id}', id)
    return this.http.get(`${this.BASE_URL}${url}`);
  }

  GetAllProfilSupervision(data): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_ALL_PROFILS_SUPERVISION);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleActivateProfil(data): Observable<any> {
    const url: string = (<string>EndPointUrl.ACTIVATE_PROFIL).replace('{id}', data)
    return this.http.put(`${this.BASE_URL}${url}`, {});
  }
  handleDisableProfil(data): Observable<any> {
    const url: string = (<string>EndPointUrl.DISABLE_PROFIL).replace('{id}', data)
    return this.http.put(`${this.BASE_URL}${url}`, {});
  }
  GetAllListAffectationBySim(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_LIST_AFFECTATION_BY_SIM).replace('{page}', page)
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  GetAllListSimAffecte(data, page): Observable<any> {
    const url: string = (<string>EndPointUrl.GET_LIST_SIM_AFFECTES).replace('{page}', page)
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleUpdateReferentielTelemetrie(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_REFERENTIEL_TELEMETRIE);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleUpdateProfilSupervision(data): Observable<any> {
    const url: string = (<string>EndPointUrl.UPDATE_PROFIL_SUPERVISION);
    return this.http.put(`${this.BASE_URL}${url}`, data);
  }
  handleSaveProfilSupervision(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_PROFIL_SUPERVISION);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleSaveAffectation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_AFFECTATION);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleSaveReaffectation(data): Observable<any> {
    const url: string = (<string>EndPointUrl.SAVE_REAFFECTATION);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  handleRetraitSim(data): Observable<any> {
    const url: string = (<string>EndPointUrl.RETRAIT_SIM);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
  OnDeploy(data): Observable<any> {
    const url: string = (<string>EndPointUrl.DEPLOYER);
    return this.http.post(`${this.BASE_URL}${url}`, data);
  }
}
