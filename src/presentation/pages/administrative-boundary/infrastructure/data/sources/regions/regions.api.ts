import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ADMINISTRATIVE_BOUNDARY_API_BASE_URL } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.config';
import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '@presentation/pages/administrative-boundary/infrastructure/api/administrative-boundary.endpoints';
import { RegionsFilterApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-filter-api.dto';
import { RegionsResponseApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-response-api.dto';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { RegionsCreateApiDto } from '../../../api/dtos/regions/regions-create-api.dto';
import { RegionsUpdateApiDto } from '../../../api/dtos/regions/regions-update-api.dto';


@Injectable({
    providedIn: 'root',
})
export class RegionsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(ADMINISTRATIVE_BOUNDARY_API_BASE_URL) private readonly baseUrl: string
    ) { }

    readAll(paramsDto: RegionsFilterApiDto, page: string): Observable<RegionsResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}?page=${page}`;
        const params = this.createHttpParams(paramsDto);

        return this.http.get<RegionsResponseApiDto>(url, { params });
    }

    private createHttpParams(payload: RegionsFilterApiDto): HttpParams {
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

    create(payload: RegionsCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/store`;
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(payload: RegionsUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const { id, ...rest } = payload;
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/${id}/update`;
        return this.http.post<SimpleResponseDto<void>>(url, rest);
    }

    delete(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.REGIONS}/${id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
