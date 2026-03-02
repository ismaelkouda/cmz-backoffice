import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';

import { CONTENT_MANAGEMENT_BASE_URL } from '@presentation/pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/api/content-management.endpoints';
import { SlideCreateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-create-api.dto';
import { SlideDeleteApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-delete-api.dto';
import { SlideFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-filter-api.dto';
import { SlidePublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-publish-api.dto';
import { SlideResponseApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-response-api.dto';
import { SlideUnpublishApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-unpublish-api.dto';
import { SlideUpdateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/slide/slide-update-api.dto';

@Injectable({ providedIn: 'root' })
export class SlideApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: SlideFilterApiDto,
        page: string
    ): Observable<SlideResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<SlideResponseApiDto>(url, {
            params,
        });
    }

    create(apiDto: SlideCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(apiDto: SlideUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(apiDto: SlideDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${apiDto.uniq_id}/delete`;
        console.log('url', url);
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    publish(apiDto: SlidePublishApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${apiDto.uniq_id}/publish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    unpublish(
        apiDto: SlideUnpublishApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${apiDto.uniq_id}/unpublish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
