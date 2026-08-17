import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { JobsResponseDto } from '../../api/dto/jobs/jobs-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { MONITORING_ENDPOINTS } from '../../api/monitoring.endpoints';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({
    providedIn: 'root',
})
export class JobsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    getJobs(options?: FetchOptions): Observable<JobsResponseDto> {
        const url = `${this.baseUrl}${MONITORING_ENDPOINTS.JOBS}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<JobsResponseDto>(url, {
            context,
        });
    }
}
