import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { MunicipalitiesSelectResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-select-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        options?: FetchOptions
    ): Observable<MunicipalitiesSelectResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/selected-field`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<MunicipalitiesSelectResponseApiDto>(url, {
            context,
        });
    }
}
