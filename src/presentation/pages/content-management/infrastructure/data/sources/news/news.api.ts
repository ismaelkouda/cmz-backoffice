import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { NewsCreateApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-create-api.dto';
import { NewsDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-delete-api.dto';
import { NewsDisableApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-disable-api.dto';
import { NewsEnableApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-enable-api.dto';
import { NewsFilterApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-filter-api.dto';
import { NewsResponseApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-response-api.dto';
import { NewsUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-update-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: NewsFilterApiDto,
        page: string
    ): Observable<NewsResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<NewsResponseApiDto>(url, {
            params,
        });
    }

    create(apiDto: NewsCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(apiDto: NewsUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(apiDto: NewsDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${apiDto.uniq_id}/delete`;
        console.log('url', url);
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(apiDto: NewsEnableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${apiDto.uniq_id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(apiDto: NewsDisableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${apiDto.uniq_id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
