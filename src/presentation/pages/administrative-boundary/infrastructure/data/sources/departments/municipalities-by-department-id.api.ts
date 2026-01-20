import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { MunicipalitiesByDepartmentIdFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/municipalities-by-department-id-filter-api.dto';
import { MunicipalitiesByDepartmentIdResponseApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/municipalities-by-department-id-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesByDepartmentIdApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL) private readonly baseUrl: string
    ) { }

    readAll(paramsDto: MunicipalitiesByDepartmentIdFilterApiDto, page: string): Observable<MunicipalitiesByDepartmentIdResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.MUNICIPALITIES}?page=${page}`;

        const params = this.createHttpParams(paramsDto);

        return this.http.get<MunicipalitiesByDepartmentIdResponseApiDto>(url, { params });
    }

    private createHttpParams(payload: MunicipalitiesByDepartmentIdFilterApiDto): HttpParams {
        let params = new HttpParams();

        if (payload) {
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '' && key !== 'id') {
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
