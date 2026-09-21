import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { AllFilterApiDto } from '@pages/report-states/infrastructure/api/dto/all/all-filter-api.dto';
import { AllResponseApiDto } from '@pages/report-states/infrastructure/api/dto/all/all-response-api.dto';
import { REPORT_API_URL } from '@core/config/config.tokens';
import { REPORT_STATES_ENDPOINTS } from '@presentation/pages/report-states/infrastructure/api/report-states.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';
import { AllDownloadApiDto } from '@pages/report-states/infrastructure/api/dto/all/all-download-api.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';

@Injectable({ providedIn: 'root' })
export class AllApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_API_URL);

    execute(
        filter: AllFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<AllResponseApiDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.ALL}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<AllResponseApiDto>(url, {
            params,
            context,
        });
    }

    download(apiDto: AllDownloadApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${REPORT_STATES_ENDPOINTS.DOWNLOAD}`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }
}
