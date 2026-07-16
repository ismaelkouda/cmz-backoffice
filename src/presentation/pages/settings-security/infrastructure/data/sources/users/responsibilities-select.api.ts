import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_SECURITY_ENDPOINTS } from '@pages/settings-security/infrastructure/api/settings-security.endpoints';
import { Observable } from 'rxjs';

import { ResponsibilitiesSelectResponseApiDto } from '../../../api/dto/users/responsibilities-select-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class ResponsibilitiesSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    readAll(
        options?: FetchOptions
    ): Observable<ResponsibilitiesSelectResponseApiDto> {
        const url = `${this.baseUrl}${SETTINGS_SECURITY_ENDPOINTS.USERS}/responsibilities`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ResponsibilitiesSelectResponseApiDto>(url, {
            context,
        });
    }
}
