import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { JobsResponseDto } from '../../api/dto/jobs/jobs-response.dto';
import { REPORTING_API_BASE_URL } from '../../api/reporting.config';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';

@Injectable({
    providedIn: 'root',
})
export class JobsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORTING_API_BASE_URL);

    getJobs(): Observable<JobsResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REQUESTS}`;

        /* const params = this.createHttpParams(paramsDto); */

        return this.http.get<JobsResponseDto>(url);
    }
}
