import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AllFilterApiDto } from '@pages/processing/infrastructure/api/dto/all/all-filter-api.dto';
import { AllResponseApiDto } from '@pages/processing/infrastructure/api/dto/all/all-response-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { PROCESSING_ENDPOINTS } from '@pages/processing/infrastructure/api/processing.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(PROCESSING_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: AllFilterApiDto,
        page: string
    ): Observable<AllResponseApiDto> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.ALL}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<AllResponseApiDto>(url, {
            params,
        });
    }
}
