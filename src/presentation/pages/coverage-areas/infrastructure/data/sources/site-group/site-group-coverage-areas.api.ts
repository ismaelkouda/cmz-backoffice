import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import {
    SiteGroupCoverageAreaIdsApiDto,
    SiteGroupCoverageAreaReassignApiDto,
    SiteGroupCoverageAreasResponseApiDto,
    SiteGroupCoverageAreaSelectionResponseApiDto,
} from '@pages/coverage-areas/infrastructure/api/dto/site-group/site-group-coverage-area.dto';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SiteGroupCoverageAreasApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    read(
        siteGroupId: number,
        options?: FetchOptions
    ): Observable<SiteGroupCoverageAreasResponseApiDto> {
        return this.http.get<SiteGroupCoverageAreasResponseApiDto>(
            `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/${siteGroupId}`,
            { context: this.context(options) }
        );
    }

    readUnassigned(
        options?: FetchOptions
    ): Observable<SiteGroupCoverageAreaSelectionResponseApiDto> {
        return this.http.get<SiteGroupCoverageAreaSelectionResponseApiDto>(
            `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/select-field/unassigned`,
            { context: this.context(options) }
        );
    }

    assign(
        siteGroupId: number,
        dto: SiteGroupCoverageAreaIdsApiDto
    ): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/${siteGroupId}/coverage-areas/assign`,
            buildHttpPayload(dto, [])
        );
    }

    reassign(
        targetSiteGroupId: number,
        dto: SiteGroupCoverageAreaReassignApiDto
    ): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/${targetSiteGroupId}/coverage-areas/reassign`,
            buildHttpPayload(dto, [])
        );
    }

    remove(
        siteGroupId: number,
        dto: SiteGroupCoverageAreaIdsApiDto
    ): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.SITE_GROUP}/${siteGroupId}/coverage-areas/remove`,
            buildHttpPayload(dto, [])
        );
    }

    private context(options?: FetchOptions): HttpContext {
        return new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
    }
}
