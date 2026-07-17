import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { TermsUseCreateApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-create-api.dto';
import { TermsUseDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-delete-api.dto';
import { TermsUseFilterApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-filter-api.dto';
import { TermsUsePublishApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-publish-api.dto';
import { TermsUseResponseApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-response-api.dto';
import { TermsUseUnpublishApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-unpublish-api.dto';
import { TermsUseUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/terms-use/terms-use-update-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        filter: TermsUseFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<TermsUseResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.TERMS_USE}?page=${page}`;

        const params = buildHttpParams(filter);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );

        return this.http.get<TermsUseResponseApiDto>(url, {
            params,
            context,
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
