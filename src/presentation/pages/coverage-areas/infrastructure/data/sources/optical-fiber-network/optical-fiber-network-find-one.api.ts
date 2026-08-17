import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { OpticalFiberNetworkFindOneFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-find-one-filter-api.dto';
import { OpticalFiberNetworkFindOneResponseApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-find-one-response-api.dto';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    execute(
        dto?: OpticalFiberNetworkFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<OpticalFiberNetworkFindOneResponseApiDto> {
        const params = dto?.id ? `/${dto.id}` : '';
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.OPTICAL_FIBER_NETWORK}${params}`;
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<OpticalFiberNetworkFindOneResponseApiDto>(url, {
            context,
        });
    }
}
