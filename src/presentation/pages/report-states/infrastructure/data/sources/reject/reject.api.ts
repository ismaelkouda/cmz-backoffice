import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { RejectFilterApiDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-filter-api.dto';
import { RejectResponseApiDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-response-api.dto';
import { REPORT_API_URL } from '@core/config/config.tokens';
import { REPORT_STATES_ENDPOINTS } from '@presentation/pages/report-states/infrastructure/api/report-states.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';
import { RejectDownloadApiDto } from '@pages/report-states/infrastructure/api/dto/reject/reject-download-api.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class RejectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_API_URL);

    execute(
        filter: RejectFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<RejectResponseApiDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.REJECT}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<RejectResponseApiDto>(url, {
            params,
            context,
        });
    }

    download(apiDto: RejectDownloadApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.DOWNLOAD}`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }
}
