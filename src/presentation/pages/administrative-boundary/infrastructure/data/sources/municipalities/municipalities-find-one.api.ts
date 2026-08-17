import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { MunicipalitiesFindOneFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-find-one-filter-api.dto';
import { MunicipalitiesFindOneResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-find-one-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    read(
        paramsDto: MunicipalitiesFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<MunicipalitiesFindOneResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.MUNICIPALITIES}/${paramsDto.code}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<MunicipalitiesFindOneResponseApiDto>(url, {
            context,
        });
    }
}
