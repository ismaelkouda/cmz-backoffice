import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HistoryFindOneFilterApiDto } from '@shared/components/history/infrastructure/api/dtos/history-findone-filter-api.dto';
import { HistoryFindOneResponseApiDto } from '@shared/components/history/infrastructure/api/dtos/history-findone-response-api.dto';
import { HISTORY_ENDPOINTS } from '@shared/components/history/infrastructure/api/dtos/history.endpoints';
import { HISTORY_BASE_URL } from '@shared/components/history/infrastructure/api/history.base-url';

@Injectable({ providedIn: 'root' })
export class HistoryFindonApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(HISTORY_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        filter?: HistoryFindOneFilterApiDto
    ): Observable<HistoryFindOneResponseApiDto> {
        const params = filter?.id ? `/${filter.id}` : '';
        const url = `${this.baseUrl}${HISTORY_ENDPOINTS.HISTORY}/${params}`;
        return this.http.get<HistoryFindOneResponseApiDto>(url);
    }
}
