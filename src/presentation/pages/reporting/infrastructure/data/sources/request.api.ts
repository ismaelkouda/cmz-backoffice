import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RequestResponseDto } from '../../api/dto/requests/request-response.dto';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class RequestApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    getRequests(options?: FetchOptions): Observable<RequestResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REQUESTS}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<RequestResponseDto>(url, {
            context,
        });
    }
}
