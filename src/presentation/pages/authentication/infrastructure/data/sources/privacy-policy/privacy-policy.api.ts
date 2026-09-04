import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { AUTHENTICATION_ENDPOINTS } from '@presentation/pages/authentication/infrastructure/api/authentication.endpoints';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    accept(): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${AUTHENTICATION_ENDPOINTS.PRIVACY_ACCEPT}`;
        return this.http.post<MessageResponseDto>(url, {});
    }
}
