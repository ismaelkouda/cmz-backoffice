import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';

import { CONTENT_MANAGEMENT_BASE_URL } from '@presentation/pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/api/content-management.endpoints';
import { TermsUseCreateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-create-api.dto';
import { TermsUseDeleteApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-delete-api.dto';
import { TermsUseFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-filter-api.dto';
import { TermsUsePublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-publish-api.dto';
import { TermsUseResponseApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-response-api.dto';
import { TermsUseUnpublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-unpublish-api.dto';
import { TermsUseUpdateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/terms-use/terms-use-update-api.dto';

@Injectable({ providedIn: 'root' })
export class TermsUseApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: TermsUseFilterApiDto,
        page: string
    ): Observable<TermsUseResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.TERMS_USE}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<TermsUseResponseApiDto>(url, {
            params,
        });
    }

    create(apiDto: TermsUseCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.TERMS_USE}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(apiDto: TermsUseUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.TERMS_USE}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(apiDto: TermsUseDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.TERMS_USE}/${apiDto.uniq_id}/delete`;
        console.log('url', url);
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    publish(
        apiDto: TermsUsePublishApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.TERMS_USE}/${apiDto.uniq_id}/publish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    unpublish(
        apiDto: TermsUseUnpublishApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.TERMS_USE}/${apiDto.uniq_id}/unpublish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
