import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { SlideCreateApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-create-api.dto';
import { SlideDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-delete-api.dto';
import { SlideDisableApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-disable-api.dto';
import { SlideEnableApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-enable-api.dto';
import { SlideFilterApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-filter-api.dto';
import { SlideResponseApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-response-api.dto';
import { SlideUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-update-api.dto';
import { formDataBuilder } from '@shared/constants/formDataBuilder.constant';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(CONTENT_MANAGEMENT_BASE_URL);

    readAll(
        filter: SlideFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<SlideResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}?page=${page}`;

        const params = buildHttpParams(filter);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );

        return this.http.get<SlideResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(apiDto: SlideCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/store`;
        const payload = buildHttpPayload(apiDto, []);
        const formData = formDataBuilder(payload);
        return this.http.post<SimpleResponseDto<void>>(url, formData);
    }

    update(apiDto: SlideUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        const formData = formDataBuilder(payload);
        return this.http.post<SimpleResponseDto<void>>(url, formData);
    }

    delete(apiDto: SlideDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${apiDto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(apiDto: SlideEnableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${apiDto.uniq_id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(apiDto: SlideDisableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${apiDto.uniq_id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
