import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ResourcesResponseDto } from '../../api/dto/resources/resources-response.dto';
import { MONITORING_API_BASE_URL } from '../../api/monitoring.config';
import { MONITORING_ENDPOINTS } from '../../api/monitoring.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ResourcesApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(MONITORING_API_BASE_URL);

    getResources(options?: FetchOptions): Observable<ResourcesResponseDto> {
        const url = `${this.baseUrl}${MONITORING_ENDPOINTS.VARIABLES}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ResourcesResponseDto>(url, {
            context,
        });
    }
}
