import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { JobsResponseDto } from '../../api/dto/jobs/jobs-response.dto';
import { REPORTING_API_BASE_URL } from '../../api/reporting.config';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class JobsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORTING_API_BASE_URL);

    getJobs(options?: FetchOptions): Observable<JobsResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REQUESTS}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<JobsResponseDto>(url, {
            context,
        });
    }
}
