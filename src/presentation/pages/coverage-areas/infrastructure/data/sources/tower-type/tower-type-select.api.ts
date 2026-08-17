import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { TowerTypeSelectResponseApiDto } from '@pages/coverage-areas/infrastructure/api/dto/tower-type/tower-type-select-response-api.dto';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class TowerTypeSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(options?: FetchOptions): Observable<TowerTypeSelectResponseApiDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.TOWER_TYPE}/select-field`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<TowerTypeSelectResponseApiDto>(url, {
            context,
        });
    }
}
