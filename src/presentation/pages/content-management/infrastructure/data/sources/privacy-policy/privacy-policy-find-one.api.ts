import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { PrivacyPolicyFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-find-one-filter-api.dto';
import { PrivacyPolicyFindOneResponseApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-find-one-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(CONTENT_MANAGEMENT_BASE_URL);

    read(
        filter?: PrivacyPolicyFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<PrivacyPolicyFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.PRIVACY_POLICY}/${filter?.id}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<PrivacyPolicyFindOneResponseApiDto>(url, {
            context,
        });
    }
}
