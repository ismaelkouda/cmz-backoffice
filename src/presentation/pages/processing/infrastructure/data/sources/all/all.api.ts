import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { AllFilterApiDto } from '@pages/processing/infrastructure/api/dto/all/all-filter-api.dto';
import { AllResponseApiDto } from '@pages/processing/infrastructure/api/dto/all/all-response-api.dto';
import { REPORT_API_URL } from '@core/config/config.tokens';
import { PROCESSING_ENDPOINTS } from '@pages/processing/infrastructure/api/processing.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REPORT_API_URL);

    execute(
        filter: AllFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<AllResponseApiDto> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.ALL}?page=${page}`;
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
}
