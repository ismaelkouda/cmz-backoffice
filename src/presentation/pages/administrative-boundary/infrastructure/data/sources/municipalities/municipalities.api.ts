import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { MunicipalitiesCreateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-create-api.dto';
import { MunicipalitiesDeleteApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-delete-api.dto';
import { MunicipalitiesFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-filter-api.dto';
import { MunicipalitiesResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-response-api.dto';
import { MunicipalitiesUpdateApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-update-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL);

    readAll(
        paramsDto: MunicipalitiesFilterApiDto,
        page: string
    ): Observable<MunicipalitiesResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.MUNICIPALITIES}?page=${page}`;

        const params = this.createHttpParams(paramsDto);

        return this.http.get<MunicipalitiesResponseApiDto>(url, { params });
    }

    private createHttpParams(payload: MunicipalitiesFilterApiDto): HttpParams {
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

    create(
        payload: MunicipalitiesCreateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.MUNICIPALITIES}/store`;
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(
        payload: MunicipalitiesUpdateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const { id, ...rest } = payload;
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.MUNICIPALITIES}/${id}/update`;
        return this.http.post<SimpleResponseDto<void>>(url, rest);
    }

    delete(
        dto: MunicipalitiesDeleteApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.MUNICIPALITIES}/${dto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
