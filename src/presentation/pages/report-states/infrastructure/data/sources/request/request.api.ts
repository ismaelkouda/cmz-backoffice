import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { REPORT_API_URL } from '@core/config/config.tokens';
import { RequestFilterApiDto } from '@pages/report-states/infrastructure/api/dto/request/request-filter-api.dto';
import { RequestResponseApiDto } from '@pages/report-states/infrastructure/api/dto/request/request-response-api.dto';
import { RequestDownloadApiDto } from '@pages/report-states/infrastructure/api/dto/request/request-download-api.dto';
import { REPORT_STATES_ENDPOINTS } from '@presentation/pages/report-states/infrastructure/api/report-states.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RequestApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_API_URL);

    execute(
        filter: RequestFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<RequestResponseApiDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.APPROVE}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<RequestResponseApiDto>(url, {
            params,
            context,
        });
    }

    download(apiDto: RequestDownloadApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.DOWNLOAD}`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }
}
