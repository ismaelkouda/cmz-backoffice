import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { DepartmentsFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-filter-api.dto';
import { DepartmentsResponseApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-response-api.dto';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { DepartmentsCreateApiDto } from '../../../api/dtos/departments/departments-create-api.dto';
import { DepartmentsUpdateApiDto } from '../../../api/dtos/departments/departments-update-api.dto';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL) private readonly baseUrl: string
    ) { }

    readAll(paramsDto: DepartmentsFilterApiDto, page: string): Observable<DepartmentsResponseApiDto> {

        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}?page=${page}`;

        const params = this.createHttpParams(paramsDto);

        return this.http.get<DepartmentsResponseApiDto>(url, { params });
    }

    private createHttpParams(payload: DepartmentsFilterApiDto): HttpParams {
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

    create(payload: DepartmentsCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/store`;

        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(payload: DepartmentsUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const { id, ...rest } = payload;
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/${id}/update`;
        return this.http.post<SimpleResponseDto<void>>(url, rest);
    }

    delete(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/${id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
