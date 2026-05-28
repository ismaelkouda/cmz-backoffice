import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ReportResponseDto } from '../../api/dto/report/report-response.dto';
import { REPORTING_API_BASE_URL } from '../../api/reporting.config';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';

@Injectable({
    providedIn: 'root',
})
export class ReportApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORTING_API_BASE_URL);

    getReport(): Observable<ReportResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REPORT}`;

        return this.http.get<ReportResponseDto>(url);
    }
}
