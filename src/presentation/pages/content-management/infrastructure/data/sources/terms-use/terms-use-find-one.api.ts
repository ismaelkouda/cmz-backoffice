import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { TermsUseFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-find-one-filter-api.dto';
import { TermsUseFindOneResponseApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-find-one-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(CONTENT_MANAGEMENT_BASE_URL);

    read(
        filter?: TermsUseFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<TermsUseFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.TERMS_USE}/${filter?.id}`;
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<TermsUseFindOneResponseApiDto>(url, {
            context,
        });
    }
}
