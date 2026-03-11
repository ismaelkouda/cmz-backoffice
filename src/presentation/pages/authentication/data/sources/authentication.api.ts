import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthenticationEndpoint } from '@pages/authentication/data/constants/authentication-endpoints.constant';
import { LoginRequestDto } from '@pages/authentication/data/dto/login-request.dto';
import { LoginResponseDto } from '@pages/authentication/data/dto/login-response.dto';
import { VariablesResponseDto } from '@pages/authentication/data/dto/variables-response.dto';
import { EnvService } from '@shared/domain/services/env.service';
import { Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AuthenticationApi {
    private readonly envService = inject(EnvService);
    private readonly http = inject(HttpClient);
    private readonly baseUrl = this.envService.authenticationUrl;

    login(payload: LoginRequestDto): Observable<LoginResponseDto> {
        const url = `${this.baseUrl}${AuthenticationEndpoint.LOGIN}`;
        return this.http.post<LoginResponseDto>(url, payload);
    }

    loadVariables(): Observable<VariablesResponseDto> {
        const url = `${this.baseUrl}${AuthenticationEndpoint.VARIABLES}`;
        return this.http.post<VariablesResponseDto>(url, {});
    }
}
