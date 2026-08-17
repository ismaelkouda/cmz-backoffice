import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { LegalNoticeFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-find-one-filter-api.dto';
import { LegalNoticeFindOneResponseApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-find-one-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    read(
        filter?: LegalNoticeFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<LegalNoticeFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.LEGAL_NOTICE}/${filter?.id}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<LegalNoticeFindOneResponseApiDto>(url, {
            context,
        });
    }
}
