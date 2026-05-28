import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { HistoryFilterApiDto } from '@shared/components/history/infrastructure/api/dto/history-filter-api.dto';
import { HistoryResponseApiDto } from '@shared/components/history/infrastructure/api/dto/history-response.api.dto';
import { HISTORY_ENDPOINTS } from '@shared/components/history/infrastructure/api/dto/history.endpoints';
import { HISTORY_BASE_URL } from '@shared/components/history/infrastructure/api/history.base-url';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HistoryApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(HISTORY_BASE_URL);

    readAll(
        filter: HistoryFilterApiDto,
        page: string
    ): Observable<HistoryResponseApiDto> {
        const url = `${this.baseUrl}${HISTORY_ENDPOINTS.HISTORY}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<HistoryResponseApiDto>(url, { params });
    }
}
