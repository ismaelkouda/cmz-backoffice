import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { SiteGroupFindOneFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-find-one-filter-api.dto';
import { SiteGroupFindOneResponseApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-find-one-response-api.dto';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class SiteGroupFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    execute(
        dto?: SiteGroupFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<SiteGroupFindOneResponseApiDto> {
        const params = dto?.id ? `/${dto.id}` : '';
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}${params}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<SiteGroupFindOneResponseApiDto>(url, {
            context,
        });
    }
}
