import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { PrivacyPolicyFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-find-one-filter-api.dto';
import { PrivacyPolicyFindOneResponseApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-find-one-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        filter?: PrivacyPolicyFindOneFilterApiDto
    ): Observable<PrivacyPolicyFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.PRIVACY_POLICY}/${filter?.id}`;
        return this.http.get<PrivacyPolicyFindOneResponseApiDto>(url);
    }
}
