import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ReportByPopulationsResponseDto } from '../../api/dto/report-by-populations/report-by-populations-response.dto';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportByPopulationsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    getReportByPopulations(
        options?: FetchOptions
    ): Observable<ReportByPopulationsResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REPORT_BY_POPULATIONS}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ReportByPopulationsResponseDto>(url, {
            context,
        });
    }
}
