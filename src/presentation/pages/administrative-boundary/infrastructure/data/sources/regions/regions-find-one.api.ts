import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { RegionsFindOneFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-find-one-filter-api.dto';
import { RegionsFindOneResponseApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/regions-find-one-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegionsFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL)
        private readonly baseUrl: string
    ) {}

    read(
        paramsDto: RegionsFindOneFilterApiDto
    ): Observable<RegionsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/${paramsDto.code}`;

        return this.http.get<RegionsFindOneResponseApiDto>(url);
    }
}
