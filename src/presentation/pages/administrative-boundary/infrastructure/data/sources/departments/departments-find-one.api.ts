import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '../../../api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '../../../api/administrative-boundary.endpoints';
import { DepartmentsFindOneFilterApiDto } from '../../../api/dto/departments/departments-find-one-filter-api.dto';
import { DepartmentsFindOneResponseApiDto } from '../../../api/dto/departments/departments-find-one-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL)
        private readonly baseUrl: string
    ) {}

    read(
        paramsDto: DepartmentsFindOneFilterApiDto
    ): Observable<DepartmentsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/${paramsDto.uniq_id}`;

        return this.http.get<DepartmentsFindOneResponseApiDto>(url);
    }
}
