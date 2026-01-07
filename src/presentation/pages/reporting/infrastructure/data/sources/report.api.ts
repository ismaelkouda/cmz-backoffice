import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReportResponseDto } from '../../api/dtos/report/report-response.dto';
import { REPORTING_API_BASE_URL } from '../../api/reporting.config';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';

@Injectable({
    providedIn: 'root',
})
export class ReportApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REPORTING_API_BASE_URL) private readonly baseUrl: string
    ) { }

    getReport(): Observable<ReportResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REPORT}`;

        return this.http.get<ReportResponseDto>(url);
    }
}
