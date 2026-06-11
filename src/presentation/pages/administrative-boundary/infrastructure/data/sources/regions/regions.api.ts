import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { RegionsCreateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-create-api.dto';
import { RegionsDeleteApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-delete-api.dto';
import { RegionsFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-filter-api.dto';
import { RegionsResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-response-api.dto';
import { RegionsUpdateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-update-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegionsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL);

    readAll(
        paramsDto: RegionsFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<RegionsResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}?page=${page}`;
        const params = this.createHttpParams(paramsDto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<RegionsResponseApiDto>(url, {
            params,
            context,
        });
    }

    private createHttpParams(payload: RegionsFilterApiDto): HttpParams {
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

    create(dto: RegionsCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/store`;
        return this.http.post<SimpleResponseDto<void>>(url, dto);
    }

    update(dto: RegionsUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const { id, ...rest } = dto;
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/${id}/update`;
        return this.http.post<SimpleResponseDto<void>>(url, rest);
    }

    delete(dto: RegionsDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/${dto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
