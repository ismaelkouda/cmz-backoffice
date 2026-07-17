import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { SiteGroupSelectResponseApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-select-response-api.dto';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class SiteGroupSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(options?: FetchOptions): Observable<SiteGroupSelectResponseApiDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/select-field`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<SiteGroupSelectResponseApiDto>(url, {
            context,
        });
    }
}
