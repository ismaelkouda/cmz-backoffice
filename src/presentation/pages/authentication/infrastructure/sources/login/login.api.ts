import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { AUTHENTICATION_ENDPOINTS } from '@presentation/pages/authentication/infrastructure/constants/authentication-endpoints.constant';
import { LoginRequestApiDto } from '@presentation/pages/authentication/infrastructure/dto/login/login-request-api.dto';
import { LoginResponseDto } from '@presentation/pages/authentication/infrastructure/dto/login/login-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    execute(payload: LoginRequestApiDto): Observable<LoginResponseDto> {
        const url = `${this.baseUrl}${AUTHENTICATION_ENDPOINTS.LOGIN}`;
        return this.http.post<LoginResponseDto>(url, payload);
    }
}
