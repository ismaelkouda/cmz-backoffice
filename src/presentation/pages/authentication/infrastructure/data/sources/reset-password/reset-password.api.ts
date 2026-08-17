import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { AUTHENTICATION_ENDPOINTS } from '@presentation/pages/authentication/infrastructure/api/authentication.endpoints';
import { ResetPasswordRequestApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/reset-password/reset-password-request-api.dto';
import { ResetPasswordResponseDto } from '@presentation/pages/authentication/infrastructure/api/dto/reset-password/reset-password-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResetPasswordApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    execute(
        dto: ResetPasswordRequestApiDto
    ): Observable<ResetPasswordResponseDto> {
        const url = `${this.baseUrl}${AUTHENTICATION_ENDPOINTS.RESET_PASSWORD}`;
        return this.http.post<ResetPasswordResponseDto>(url, dto);
    }
}
