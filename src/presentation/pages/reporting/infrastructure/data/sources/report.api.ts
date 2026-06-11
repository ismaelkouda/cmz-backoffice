import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ReportResponseDto } from '../../api/dto/report/report-response.dto';
import { REPORTING_API_BASE_URL } from '../../api/reporting.config';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORTING_API_BASE_URL);

    getReport(options?: FetchOptions): Observable<ReportResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REPORT}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ReportResponseDto>(url, {
            context,
        });
    }
}
