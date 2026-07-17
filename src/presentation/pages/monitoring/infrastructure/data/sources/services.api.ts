import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ServicesResponseDto } from '../../api/dto/services/services-response.dto';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { MONITORING_ENDPOINTS } from '../../api/monitoring.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ServicesApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    getServices(options?: FetchOptions): Observable<ServicesResponseDto> {
        const url = `${this.baseUrl}${MONITORING_ENDPOINTS.SERVICES}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ServicesResponseDto>(url, {
            context,
        });
    }
}
