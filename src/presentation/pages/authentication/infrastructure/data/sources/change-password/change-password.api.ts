import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { AUTHENTICATION_ENDPOINTS } from '@presentation/pages/authentication/infrastructure/api/authentication.endpoints';
import { ChangePasswordRequestApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/change-password/change-password-request-api.dto';
import { ChangePasswordResponseApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/change-password/change-password-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChangePasswordApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    execute(
        dto: ChangePasswordRequestApiDto
    ): Observable<ChangePasswordResponseApiDto> {
        const url = `${this.baseUrl}${AUTHENTICATION_ENDPOINTS.CHANGE_PASSWORD}`;
        return this.http.post<ChangePasswordResponseApiDto>(url, dto);
    }
}
