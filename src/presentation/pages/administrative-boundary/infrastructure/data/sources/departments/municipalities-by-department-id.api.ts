import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { MunicipalitiesByDepartmentIdFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/municipalities-by-department-id-filter-api.dto';
import { MunicipalitiesByDepartmentIdResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/municipalities-by-department-id-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesByDepartmentIdApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        paramsDto: MunicipalitiesByDepartmentIdFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<MunicipalitiesByDepartmentIdResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.MUNICIPALITIES}?page=${page}`;

        const params = this.createHttpParams(paramsDto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<MunicipalitiesByDepartmentIdResponseApiDto>(url, {
            params,
            context,
        });
    }

    private createHttpParams(
        payload: MunicipalitiesByDepartmentIdFilterApiDto
    ): HttpParams {
        let params = new HttpParams();

        if (payload) {
            Object.entries(payload).forEach(([key, value]) => {
                if (
                    value !== undefined &&
                    value !== null &&
                    value !== '' &&
                    key !== 'id'
                ) {
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
