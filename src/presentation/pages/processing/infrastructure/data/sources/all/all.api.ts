import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AllFilterApiDto } from '@pages/processing/infrastructure/api/dto/all/all-filter-api.dto';
import { AllResponseApiDto } from '@pages/processing/infrastructure/api/dto/all/all-response-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { PROCESSING_ENDPOINTS } from '@pages/processing/infrastructure/api/processing.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(PROCESSING_BASE_URL);

    execute(
        filter: AllFilterApiDto,
        page: string
    ): Observable<AllResponseApiDto> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.ALL}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<AllResponseApiDto>(url, {
            params,
        });
    }
}
