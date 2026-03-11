import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AllFilterApiDto } from '@pages/finalization/infrastructure/api/dto/all/all-filter-api.dto';
import { AllResponseApiDto } from '@pages/finalization/infrastructure/api/dto/all/all-response-api.dto';
import { FINALIZATION_BASE_URL } from '@pages/finalization/infrastructure/api/finalization.base-url';
import { FINALIZATION_ENDPOINTS } from '@pages/finalization/infrastructure/api/finalization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(FINALIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: AllFilterApiDto,
        page: string
    ): Observable<AllResponseApiDto> {
        const url = `${this.baseUrl}${FINALIZATION_ENDPOINTS.ALL}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<AllResponseApiDto>(url, {
            params,
        });
    }
}
