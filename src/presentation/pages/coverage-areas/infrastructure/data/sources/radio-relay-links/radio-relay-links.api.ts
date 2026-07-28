import { Injectable, inject } from '@angular/core';
import { RadioRelayLinksFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-filter-api.dto';
import { RadioRelayLinksFindOneFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-find-one-filter-api.dto';
import { RadioRelayLinksCreateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-create-api.dto';
import { RadioRelayLinksUpdateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-update-api.dto';
import { RadioRelayLinksDeleteApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-delete-api.dto';
import { RadioRelayLinksEnableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-enable-api.dto';
import { RadioRelayLinksDisableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/radio-relay-links/radio-relay-links-disable-api.dto';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { formDataBuilder } from '@shared/constants/formDataBuilder.constant';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { Observable } from 'rxjs';
import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';

@Injectable({ providedIn: 'root' })
export class RadioRelayLinksApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        dto: RadioRelayLinksFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<any> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.RADIO_RELAY_LINKS}?page=${page}`;
        const params = buildHttpParams(dto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<any>(url, {
            params,
            context,
        });
    }

    create(dto: RadioRelayLinksCreateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.RADIO_RELAY_LINKS}/store`;
        const payload = buildHttpPayload(dto, []);
        const formData = formDataBuilder(payload);
        return this.http.post<MessageResponseDto>(url, formData);
    }

    update(dto: RadioRelayLinksUpdateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.RADIO_RELAY_LINKS}/${dto.id}/update`;
        const payload = buildHttpPayload(dto, ['id']);
        const formData = formDataBuilder(payload);
        return this.http.post<MessageResponseDto>(url, formData);
    }

    delete(dto: RadioRelayLinksDeleteApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.RADIO_RELAY_LINKS}/${dto.uniq_id}/delete`;
        return this.http.delete<MessageResponseDto>(url);
    }

    enable(dto: RadioRelayLinksEnableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.RADIO_RELAY_LINKS}/${dto.uniq_id}/enable`;
        return this.http.put<MessageResponseDto>(url, {});
    }

    disable(dto: RadioRelayLinksDisableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.RADIO_RELAY_LINKS}/${dto.uniq_id}/disable`;
        return this.http.put<MessageResponseDto>(url, {});
    }

    findOne(dto: RadioRelayLinksFindOneFilterApiDto): Observable<any> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.RADIO_RELAY_LINKS}/${dto.id}`;
        return this.http.get<any>(url);
    }
}
