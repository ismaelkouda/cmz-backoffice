import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { MunicipalitiesSelectResponseApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-select-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL)
        private readonly baseUrl: string
    ) {}

    readAll(): Observable<MunicipalitiesSelectResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/selected-field`;

        return this.http.get<MunicipalitiesSelectResponseApiDto>(url);
    }
}
