import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { DepartmentsCreateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-create-api.dto';
import { DepartmentsDeleteApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-delete-api.dto';
import { DepartmentsFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-filter-api.dto';
import { DepartmentsResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-response-api.dto';
import { DepartmentsUpdateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-update-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        dto: DepartmentsFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<DepartmentsResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}?page=${page}`;

        const params = buildHttpParams(dto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<DepartmentsResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(dto: DepartmentsCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/store`;

        return this.http.post<SimpleResponseDto<void>>(url, dto);
    }

    update(dto: DepartmentsUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const { id, ...rest } = dto;
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/${id}/update`;
        return this.http.post<SimpleResponseDto<void>>(url, rest);
    }

    delete(dto: DepartmentsDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/${dto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
