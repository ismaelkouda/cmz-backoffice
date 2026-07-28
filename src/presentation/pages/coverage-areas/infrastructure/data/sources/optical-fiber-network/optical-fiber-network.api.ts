import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { OpticalFiberNetworkCreateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-create-api.dto';
import { OpticalFiberNetworkDeleteApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-delete-api.dto';
import { OpticalFiberNetworkDisableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-disable-api.dto';
import { OpticalFiberNetworkEnableApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-enable-api.dto';
import { OpticalFiberNetworkFilterApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-filter-api.dto';
import { OpticalFiberNetworkResponseApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-response-api.dto';
import { OpticalFiberNetworkUpdateApiDto } from '@pages/coverage-areas/infrastructure/api/dto/optical-fiber-network/optical-fiber-network-update-api.dto';
import { COVERAGE_AREAS_ENDPOINTS } from '@pages/coverage-areas/infrastructure/api/coverage-areas.endpoints';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { formDataBuilder } from '@shared/constants/formDataBuilder.constant';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class OpticalFiberNetworkApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        dto: OpticalFiberNetworkFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<OpticalFiberNetworkResponseApiDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.OPTICAL_FIBER_NETWORK}?page=${page}`;
        const params = buildHttpParams(dto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<OpticalFiberNetworkResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(
        dto: OpticalFiberNetworkCreateApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.OPTICAL_FIBER_NETWORK}/store`;
        const payload = buildHttpPayload(dto, []);
        const formData = formDataBuilder(payload);
        return this.http.post<MessageResponseDto>(url, formData);
    }

    update(
        dto: OpticalFiberNetworkUpdateApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.OPTICAL_FIBER_NETWORK}/${dto.id}/update`;
        const payload = buildHttpPayload(dto, ['id']);
        const formData = formDataBuilder(payload);
        return this.http.post<MessageResponseDto>(url, formData);
    }

    delete(
        dto: OpticalFiberNetworkDeleteApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.OPTICAL_FIBER_NETWORK}/${dto.uniq_id}/delete`;
        return this.http.delete<MessageResponseDto>(url);
    }

    enable(
        dto: OpticalFiberNetworkEnableApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.OPTICAL_FIBER_NETWORK}/${dto.uniq_id}/enable`;
        return this.http.put<MessageResponseDto>(url, {});
    }

    disable(
        dto: OpticalFiberNetworkDisableApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COVERAGE_AREAS_ENDPOINTS.OPTICAL_FIBER_NETWORK}/${dto.uniq_id}/disable`;
        return this.http.put<MessageResponseDto>(url, {});
    }
}
