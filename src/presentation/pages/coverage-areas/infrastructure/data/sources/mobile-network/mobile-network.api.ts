import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { MobileNetworkCreateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-create-api.dto';
import { MobileNetworkDeleteApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-delete-api.dto';
import { MobileNetworkDisableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-disable-api.dto';
import { MobileNetworkEnableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-enable-api.dto';
import { MobileNetworkFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-filter-api.dto';
import { MobileNetworkResponseApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-response-api.dto';
import { MobileNetworkUpdateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/mobile-network/mobile-network-update-api.dto';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class MobileNetworkApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        dto: MobileNetworkFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<MobileNetworkResponseApiDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.MOBILE_NETWORK}?page=${page}`;

        const params = buildHttpParams(dto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<MobileNetworkResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(dto: MobileNetworkCreateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.MOBILE_NETWORK}/store`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    update(dto: MobileNetworkUpdateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.MOBILE_NETWORK}/${dto.id}/update`;
        const payload = buildHttpPayload(dto, ['id']);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    delete(dto: MobileNetworkDeleteApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.MOBILE_NETWORK}/${dto.uniq_id}/delete`;
        return this.http.delete<MessageResponseDto>(url);
    }

    enable(dto: MobileNetworkEnableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.MOBILE_NETWORK}/${dto.uniq_id}/enable`;
        return this.http.put<MessageResponseDto>(url, {});
    }

    disable(dto: MobileNetworkDisableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.MOBILE_NETWORK}/${dto.uniq_id}/disable`;
        return this.http.put<MessageResponseDto>(url, {});
    }
}
