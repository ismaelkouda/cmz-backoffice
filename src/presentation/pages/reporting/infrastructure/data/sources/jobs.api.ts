import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { JobsResponseDto } from '../../api/dto/jobs/jobs-response.dto';
import { REPORTING_API_BASE_URL } from '../../api/reporting.config';
import { REPORTING_ENDPOINTS } from '../../api/reporting.endpoints';

@Injectable({
    providedIn: 'root',
})
export class JobsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REPORTING_API_BASE_URL) private readonly baseUrl: string
    ) {}

    getJobs(): Observable<JobsResponseDto> {
        const url = `${this.baseUrl}${REPORTING_ENDPOINTS.REQUESTS}`;

        /* const params = this.createHttpParams(paramsDto); */

        return this.http.get<JobsResponseDto>(url);
    }
}
