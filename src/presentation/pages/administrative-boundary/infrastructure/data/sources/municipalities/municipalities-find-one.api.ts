import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { MunicipalitiesFindOneFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-find-one-filter-api.dto';
import { MunicipalitiesFindOneResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-find-one-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL)
        private readonly baseUrl: string
    ) {}

    read(
        paramsDto: MunicipalitiesFindOneFilterApiDto
    ): Observable<MunicipalitiesFindOneResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.MUNICIPALITIES}/${paramsDto.code}`;

        return this.http.get<MunicipalitiesFindOneResponseApiDto>(url);
    }
}
