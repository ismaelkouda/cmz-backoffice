import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { RegionsFindoneFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-findone-filter-api.dto';
import { RegionsFindoneResponseApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-findone-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegionsFindoneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL) private readonly baseUrl: string
    ) { }

    read(paramsDto: RegionsFindoneFilterApiDto): Observable<RegionsFindoneResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/${paramsDto.code}`;
        const params = this.createHttpParams(paramsDto);

        return this.http.get<RegionsFindoneResponseApiDto>(url);
    }

    private createHttpParams(payload: RegionsFindoneFilterApiDto): HttpParams {
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
