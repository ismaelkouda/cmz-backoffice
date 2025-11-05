import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from './../../../../shared/services/env.service';

@Injectable()
export class PasswordResetService {
    public baseUrl: string;

    constructor(
        private http: HttpClient,
        private envService: EnvService
    ) {
        this.baseUrl = this.envService.apiUrl;
    }

    //HandleForgotPassword(data): Observable<any> {
    //  const url: string = <string>EndPointUrl.FORGOT_PASSWORD;
    //  return this.http.post(`${this.baseUrl}${url}`, data);
    //}

    //HandleResetPassword(data): Observable<any> {
    //  const url: string = <string>EndPointUrl.RESET_PASSWORD;
    //return this.http.post(`${this.baseUrl}${url}`, data);
    //}
}
