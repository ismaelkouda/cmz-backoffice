import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { DepartmentsByRegionIdFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/departments-by-region-id-filter-api.dto';
import { DepartmentsByRegionIdResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/departments-by-region-id-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        paramsDto: DepartmentsByRegionIdFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<DepartmentsByRegionIdResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}?page=${page}`;

        const params = this.createHttpParams(paramsDto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<DepartmentsByRegionIdResponseApiDto>(url, {
            params,
            context,
        });
    }

    private createHttpParams(
        payload: DepartmentsByRegionIdFilterApiDto
    ): HttpParams {
        let params = new HttpParams();

        if (payload) {
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (value instanceof Date) {
                        params = params.set(key, value.toISOString());
                    } else {
                        params = params.set(key, String(value));
                    }
                }
            });
        }

        return params;
    }
}
