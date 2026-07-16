import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeCreateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-create-api.dto';
import { InfrastructureTypeDeleteApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-delete-api.dto';
import { InfrastructureTypeDisableApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-disable-api.dto';
import { InfrastructureTypeEnableApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-enable-api.dto';
import { InfrastructureTypeFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-filter-api.dto';
import { InfrastructureTypeResponseApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-response-api.dto';
import { InfrastructureTypeUpdateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-update-api.dto';
import { ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.endpoints';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        filter: InfrastructureTypeFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<InfrastructureTypeResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}?page=${page}`;

        const params = buildHttpParams(filter);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<InfrastructureTypeResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(
        apiDto: InfrastructureTypeCreateApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    update(
        apiDto: InfrastructureTypeUpdateApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    delete(
        apiDto: InfrastructureTypeDeleteApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/${apiDto.uniq_id}/delete`;
        return this.http.delete<MessageResponseDto>(url);
    }

    enable(
        apiDto: InfrastructureTypeEnableApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/${apiDto.uniq_id}/enable`;
        return this.http.put<MessageResponseDto>(url, {});
    }

    disable(
        apiDto: InfrastructureTypeDisableApiDto
    ): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/${apiDto.uniq_id}/disable`;
        return this.http.put<MessageResponseDto>(url, {});
    }
}
