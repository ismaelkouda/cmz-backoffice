import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { NewsCreateApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-create-api.dto';
import { NewsDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-delete-api.dto';
import { NewsUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-disable-api.dto';
import { NewsPublishApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-enable-api.dto';
import { NewsFilterApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-filter-api.dto';
import { NewsResponseApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-response-api.dto';
import { NewsUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-update-api.dto';
import { formDataBuilder } from '@shared/constants/formDataBuilder.constant';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        filter: NewsFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<NewsResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}?page=${page}`;

        const params = buildHttpParams(filter);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );

        return this.http.get<NewsResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(apiDto: NewsCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/store`;
        const payload = buildHttpPayload(apiDto, []);
        const formData = formDataBuilder(payload);
        return this.http.post<SimpleResponseDto<void>>(url, formData);
    }

    update(apiDto: NewsUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        const formData = formDataBuilder(payload);
        return this.http.post<SimpleResponseDto<void>>(url, formData);
    }

    delete(apiDto: NewsDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${apiDto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    publish(apiDto: NewsPublishApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${apiDto.uniq_id}/publish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    unpublish(
        apiDto: NewsUnpublishApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${apiDto.uniq_id}/unpublish`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
