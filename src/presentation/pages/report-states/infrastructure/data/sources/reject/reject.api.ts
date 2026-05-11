import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { RejectFilterApiDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-filter-api.dto';
import { RejectResponseApiDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-response-api.dto';
import { REPORT_STATES_BASE_URL } from '@presentation/pages/report-states/infrastructure/api/report-states.base-url';
import { REPORT_STATES_ENDPOINTS } from '@presentation/pages/report-states/infrastructure/api/report-states.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RejectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REPORT_STATES_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: RejectFilterApiDto,
        page: string
    ): Observable<RejectResponseApiDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.REJECT}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<RejectResponseApiDto>(url, {
            params,
        });
    }
}
