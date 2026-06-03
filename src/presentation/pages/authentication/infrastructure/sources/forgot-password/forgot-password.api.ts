import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { AuthenticationEndpoint } from '@presentation/pages/authentication/infrastructure/constants/authentication-endpoints.constant';
import { ForgotPasswordRequestApiDto } from '@presentation/pages/authentication/infrastructure/dto/forgot-password/forgot-password-request-api.dto';
import { ForgotPasswordResponseDto } from '@presentation/pages/authentication/infrastructure/dto/forgot-password/forgot-password-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    execute(
        payload: ForgotPasswordRequestApiDto
    ): Observable<ForgotPasswordResponseDto> {
        const url = `${this.baseUrl}${AuthenticationEndpoint.FORGOT_PASSWORD}`;
        return this.http.post<ForgotPasswordResponseDto>(url, payload);
    }
}
