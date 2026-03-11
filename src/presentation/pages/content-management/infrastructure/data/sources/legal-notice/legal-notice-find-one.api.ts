import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { LegalNoticeFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-find-one-filter-api.dto';
import { LegalNoticeFindOneResponseApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-find-one-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        filter?: LegalNoticeFindOneFilterApiDto
    ): Observable<LegalNoticeFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.LEGAL_NOTICE}/${filter?.id}`;
        return this.http.get<LegalNoticeFindOneResponseApiDto>(url);
    }
}
