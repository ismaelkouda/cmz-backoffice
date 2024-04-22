import { EnvService } from './../../../../shared/services/env.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { EndPointUrl } from './api.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public baseUrl: string;

  constructor(
    private http: HttpClient,
    private envService: EnvService,

  ) {
    this.baseUrl = this.envService.apiUrl
  }

  OnLogin(data): Observable<any> {
    const url: string = (<string>EndPointUrl.AUTHENTICATION);
    return this.http.post(`${this.baseUrl}${url}`, data);
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
