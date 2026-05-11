import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CloseFilterApiDto } from '@pages/report-states/infrastructure/api/dto/close/close-filter-api.dto';
import { CloseResponseApiDto } from '@pages/report-states/infrastructure/api/dto/close/close-response-api.dto';
import { REPORT_STATES_BASE_URL } from '@presentation/pages/report-states/infrastructure/api/report-states.base-url';
import { REPORT_STATES_ENDPOINTS } from '@presentation/pages/report-states/infrastructure/api/report-states.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CloseApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REPORT_STATES_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: CloseFilterApiDto,
        page: string
    ): Observable<CloseResponseApiDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.CLOSE}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<CloseResponseApiDto>(url, {
            params,
        });
    }
}
