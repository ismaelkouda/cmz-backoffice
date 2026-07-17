import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { SiteGroupCreateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-create-api.dto';
import { SiteGroupDeleteApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-delete-api.dto';
import { SiteGroupDisableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-disable-api.dto';
import { SiteGroupEnableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-enable-api.dto';
import { SiteGroupFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-filter-api.dto';
import { SiteGroupResponseApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-response-api.dto';
import { SiteGroupUpdateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-update-api.dto';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class SiteGroupApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        dto: SiteGroupFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<SiteGroupResponseApiDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}?page=${page}`;

        const params = buildHttpParams(dto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<SiteGroupResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(dto: SiteGroupCreateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/store`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    update(dto: SiteGroupUpdateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/${dto.id}/update`;
        const payload = buildHttpPayload(dto, ['id']);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    delete(dto: SiteGroupDeleteApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/${dto.uniq_id}/delete`;
        return this.http.delete<MessageResponseDto>(url);
    }

    enable(dto: SiteGroupEnableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/${dto.uniq_id}/enable`;
        return this.http.put<MessageResponseDto>(url, {});
    }

    disable(dto: SiteGroupDisableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/${dto.uniq_id}/disable`;
        return this.http.put<MessageResponseDto>(url, {});
    }
}
