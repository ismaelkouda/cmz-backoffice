import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CONTENT_MANAGEMENT_BASE_URL } from '@presentation/pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/api/content-management.endpoints';
import { TermsUseFindOneFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-find-one-filter-api.dto';
import { TermsUseFindOneResponseApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-find-one-response-api.dto';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        filter?: TermsUseFindOneFilterApiDto
    ): Observable<TermsUseFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${filter?.id}`;
        return this.http.get<TermsUseFindOneResponseApiDto>(url);
    }
}
