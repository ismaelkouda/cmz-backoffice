import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { MunicipalitiesSelectResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-select-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL);

    readAll(): Observable<MunicipalitiesSelectResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/selected-field`;

        return this.http.get<MunicipalitiesSelectResponseApiDto>(url);
    }
}
