import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { PrivacyPolicyCreateApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-create-api.dto';
import { PrivacyPolicyDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-delete-api.dto';
import { PrivacyPolicyFilterApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-filter-api.dto';
import { PrivacyPolicyPublishApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-publish-api.dto';
import { PrivacyPolicyResponseApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-response-api.dto';
import { PrivacyPolicyUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-unpublish-api.dto';
import { PrivacyPolicyUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/privacy-policy/privacy-policy-update-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(CONTENT_MANAGEMENT_BASE_URL);

    readAll(
        filter: PrivacyPolicyFilterApiDto,
        page: string
    ): Observable<PrivacyPolicyResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.PRIVACY_POLICY}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<PrivacyPolicyResponseApiDto>(url, {
            params,
        });
    }

    create(
        apiDto: PrivacyPolicyCreateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.PRIVACY_POLICY}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(
        apiDto: PrivacyPolicyUpdateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.PRIVACY_POLICY}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(
        apiDto: PrivacyPolicyDeleteApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.PRIVACY_POLICY}/${apiDto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    publish(
        apiDto: PrivacyPolicyPublishApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.PRIVACY_POLICY}/${apiDto.uniq_id}/publish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    unpublish(
        apiDto: PrivacyPolicyUnpublishApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.PRIVACY_POLICY}/${apiDto.uniq_id}/unpublish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
