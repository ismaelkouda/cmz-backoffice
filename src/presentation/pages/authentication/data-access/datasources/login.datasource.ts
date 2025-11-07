import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ConfigurationService } from "../../../../../core/services/configuration.service";
import { LoginCredential } from "../../domain/entities/login.credential";
import { EndPointUrl } from "../api.enum";
import { LoginResponseInterface } from "../interfaces/login-response.interface";

Injectable()

export class LoginDataSource {

    private configService = inject(ConfigurationService);
    private readonly baseUrl = this.configService.reportUrl;

    constructor(private http: HttpClient) {}

    fetchLogin(credentials: LoginCredential): Observable<LoginResponseInterface> {
        const url = `${this.baseUrl}${EndPointUrl.AUTHENTICATION}`;
        return this.http.post<LoginResponseInterface>(url, credentials);
    }
}