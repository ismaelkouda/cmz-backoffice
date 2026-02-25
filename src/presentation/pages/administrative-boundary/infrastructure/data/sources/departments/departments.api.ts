import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { DepartmentsCreateApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-create-api.dto';
import { DepartmentsDeleteApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-delete-api.dto';
import { DepartmentsFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-filter-api.dto';
import { DepartmentsResponseApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-response-api.dto';
import { DepartmentsUpdateApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/departments/departments-update-api.dto';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL)
        private readonly baseUrl: string
    ) {}

    readAll(
        dto: DepartmentsFilterApiDto,
        page: string
    ): Observable<DepartmentsResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}?page=${page}`;

        const params = buildHttpParams(dto);

        return this.http.get<DepartmentsResponseApiDto>(url, { params });
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
