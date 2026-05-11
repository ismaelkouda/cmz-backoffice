import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { EvaluateFilterApiDto } from '@pages/report-states/infrastructure/api/dto/evaluate/evaluate-filter-api.dto';
import { EvaluateResponseApiDto } from '@pages/report-states/infrastructure/api/dto/evaluate/evaluate-response-api.dto';
import { REPORT_STATES_BASE_URL } from '@presentation/pages/report-states/infrastructure/api/report-states.base-url';
import { REPORT_STATES_ENDPOINTS } from '@presentation/pages/report-states/infrastructure/api/report-states.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EvaluateApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REPORT_STATES_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: EvaluateFilterApiDto,
        page: string
    ): Observable<EvaluateResponseApiDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.EVALUATE}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<EvaluateResponseApiDto>(url, {
            params,
        });
    }
}
