import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { RegionsFindOneFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-find-one-filter-api.dto';
import { RegionsFindOneResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-find-one-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegionsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    read(
        paramsDto: RegionsFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<RegionsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/${paramsDto.code}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<RegionsFindOneResponseApiDto>(url, {
            context,
        });
    }
}
