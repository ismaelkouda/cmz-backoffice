import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { DepartmentsSelectResponseApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-select-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL) private readonly baseUrl: string
    ) { }

    readAll(): Observable<DepartmentsSelectResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/selected-field`;

        return this.http.get<DepartmentsSelectResponseApiDto>(url);
    }
}
