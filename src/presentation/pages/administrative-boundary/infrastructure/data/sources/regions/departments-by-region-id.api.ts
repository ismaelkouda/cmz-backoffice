import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { DepartmentsByRegionIdFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/departments-by-region-id-filter-api.dto';
import { DepartmentsByRegionIdResponseApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/departments-by-region-id-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsByRegionIdApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL) private readonly baseUrl: string
    ) { }

    readAll(paramsDto: DepartmentsByRegionIdFilterApiDto, page: string): Observable<DepartmentsByRegionIdResponseApiDto> {
        console.log("paramsDto", paramsDto)
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}?page=${page}`;

        const params = this.createHttpParams(paramsDto);

        return this.http.get<DepartmentsByRegionIdResponseApiDto>(url, { params });
    }

    private createHttpParams(payload: DepartmentsByRegionIdFilterApiDto): HttpParams {
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
