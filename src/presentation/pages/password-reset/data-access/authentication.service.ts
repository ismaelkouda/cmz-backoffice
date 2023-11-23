import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndPointUrl } from './api.enum';

// @ts-ignore
import appConfig from '../../../../assets/config/app-config.json';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public baseUrl: string;

  constructor(
    private http: HttpClient
      ) {
    this.baseUrl = `${appConfig.serverUrl}tenants/`
  }

  HandleForgotPassword(data): Observable<any> {
    const url: string = (<string>EndPointUrl.FORGOT_PASSWORD);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }

  HandleResetPassword(data): Observable<any> {
    const url: string = (<string>EndPointUrl.RESET_PASSWORD);
    return this.http.post(`${this.baseUrl}${url}`, data);
  }
  
}
