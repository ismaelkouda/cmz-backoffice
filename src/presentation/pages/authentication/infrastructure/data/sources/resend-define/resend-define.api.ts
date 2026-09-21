import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { AUTHENTICATION_ENDPOINTS } from '@presentation/pages/authentication/infrastructure/api/authentication.endpoints';
import { ResendDefineRequestApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/resend-define/resend-define-request-api.dto';
import { ResendDefineResponseApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/resend-define/resend-define-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResendDefineApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    execute(
        dto: ResendDefineRequestApiDto
    ): Observable<ResendDefineResponseApiDto> {
        const url = `${this.baseUrl}${AUTHENTICATION_ENDPOINTS.RESEND_DEFINE}`;
        return this.http.post<ResendDefineResponseApiDto>(url, dto);
    }
}
