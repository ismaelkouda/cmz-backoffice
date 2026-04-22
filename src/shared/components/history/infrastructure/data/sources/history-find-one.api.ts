import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HistoryFindOneFilterApiDto } from '@shared/components/history/infrastructure/api/dto/history-find-one-filter-api.dto';
import { HistoryFindOneResponseApiDto } from '@shared/components/history/infrastructure/api/dto/history-find-one-response-api.dto';
import { HISTORY_ENDPOINTS } from '@shared/components/history/infrastructure/api/dto/history.endpoints';
import { HISTORY_BASE_URL } from '@shared/components/history/infrastructure/api/history.base-url';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(HISTORY_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        dto: HistoryFindOneFilterApiDto
    ): Observable<HistoryFindOneResponseApiDto> {
        const { id, ...filterParams } = dto;
        console.log('dto: ', dto);
        const params = buildHttpParams(filterParams, { skipEmptyString: true });
        const uniq_id = id ? `/${id}` : '';
        const url = `${this.baseUrl}${HISTORY_ENDPOINTS.HISTORY}${uniq_id}`;
        return this.http.get<HistoryFindOneResponseApiDto>(url, {
            params,
        });
    }
}
