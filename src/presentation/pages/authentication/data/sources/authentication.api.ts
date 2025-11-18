import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from '@shared/services/env.service';
import { AuthenticationEndpoint } from '@pages/authentication/data/constants/authentication-endpoints.constant';
import { LoginRequestDto } from '@pages/authentication/data/dtos/login-request.dto';
import { LoginResponseDto } from '@pages/authentication/data/dtos/login-response.dto';
import { VariablesResponseDto } from '@pages/authentication/data/dtos/variables-response.dto';
@Injectable({ providedIn: 'root' })
export class AuthenticationApi {
    private readonly baseUrl = this.envService.authenticationUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    login(payload: LoginRequestDto): Observable<LoginResponseDto> {
        const url = `${this.baseUrl}${AuthenticationEndpoint.LOGIN}`;
        return this.http.post<LoginResponseDto>(url, payload);
    }

    loadVariables(): Observable<VariablesResponseDto> {
        const url = `${this.baseUrl}${AuthenticationEndpoint.VARIABLES}`;
        return this.http.post<VariablesResponseDto>(url, {});
    }
}
