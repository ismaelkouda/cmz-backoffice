import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { MobileNetworkFindOneFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-find-one-filter-api.dto';
import { MobileNetworkFindOneResponseApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-find-one-response-api.dto';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class MobileNetworkFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    execute(
        dto?: MobileNetworkFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<MobileNetworkFindOneResponseApiDto> {
        const params = dto?.id ? `/${dto.id}` : '';
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.MOBILE_NETWORK}${params}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<MobileNetworkFindOneResponseApiDto>(url, {
            context,
        });
    }
}
