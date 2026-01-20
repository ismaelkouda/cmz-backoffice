import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '../../../api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '../../../api/administrative-boundary.endpoints';
import { DepartmentsFindoneFilterApiDto } from '../../../api/dtos/departments/departments-findone-filter-api.dto';
import { DepartmentsFindoneResponseApiDto } from '../../../api/dtos/departments/departments-findone-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsFindoneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL) private readonly baseUrl: string
    ) { }

    read(paramsDto: DepartmentsFindoneFilterApiDto): Observable<DepartmentsFindoneResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/${paramsDto.code}`;
        const params = this.createHttpParams(paramsDto);

        return this.http.get<DepartmentsFindoneResponseApiDto>(url);
    }

    private createHttpParams(payload: DepartmentsFindoneFilterApiDto): HttpParams {
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
