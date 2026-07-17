import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ReportByOperatorResponseDto } from '../../api/dto/report-by-operator/report-by-operator-response.dto';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({
    providedIn: 'root',
})
export class ReportByOperatorApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    getReportByOperator(
        options?: FetchOptions
    ): Observable<ReportByOperatorResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REPORT_BY_OPERATOR}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<ReportByOperatorResponseDto>(url, {
            context,
        });
    }
}
