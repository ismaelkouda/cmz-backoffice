import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { LegalNoticeCreateApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-create-api.dto';
import { LegalNoticeDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-delete-api.dto';
import { LegalNoticeFilterApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-filter-api.dto';
import { LegalNoticePublishApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-publish-api.dto';
import { LegalNoticeResponseApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-response-api.dto';
import { LegalNoticeUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-unpublish-api.dto';
import { LegalNoticeUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/legal-notice/legal-notice-update-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LegalNoticeApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(CONTENT_MANAGEMENT_BASE_URL);

    readAll(
        filter: LegalNoticeFilterApiDto,
        page: string
    ): Observable<LegalNoticeResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.LEGAL_NOTICE}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<LegalNoticeResponseApiDto>(url, {
            params,
        });
    }

    create(
        apiDto: LegalNoticeCreateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.LEGAL_NOTICE}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(
        apiDto: LegalNoticeUpdateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.LEGAL_NOTICE}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(
        apiDto: LegalNoticeDeleteApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.LEGAL_NOTICE}/${apiDto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    publish(
        apiDto: LegalNoticePublishApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.LEGAL_NOTICE}/${apiDto.uniq_id}/publish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    unpublish(
        apiDto: LegalNoticeUnpublishApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.LEGAL_NOTICE}/${apiDto.uniq_id}/unpublish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
