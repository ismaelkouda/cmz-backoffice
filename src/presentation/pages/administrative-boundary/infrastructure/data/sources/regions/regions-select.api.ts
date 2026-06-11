import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { RegionsSelectResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-select-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegionsSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL);

    readAll(options?: FetchOptions): Observable<RegionsSelectResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/selected-field`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<RegionsSelectResponseApiDto>(url, {
            context,
        });
    }
}
