import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { MunicipalitiesFindoneFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-findone-filter-api.dto';
import { MunicipalitiesFindoneResponseApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-findone-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesFindoneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL) private readonly baseUrl: string
    ) { }

    read(paramsDto: MunicipalitiesFindoneFilterApiDto): Observable<MunicipalitiesFindoneResponseApiDto> {
        console.log('paramsDto', paramsDto);
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.MUNICIPALITIES}/${paramsDto.code}`;

        const params = this.createHttpParams(paramsDto);

        return this.http.get<MunicipalitiesFindoneResponseApiDto>(url);
    }

    private createHttpParams(payload: MunicipalitiesFindoneFilterApiDto): HttpParams {
        let params = new HttpParams();

        if (payload) {
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '' && key !== 'code') {
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
