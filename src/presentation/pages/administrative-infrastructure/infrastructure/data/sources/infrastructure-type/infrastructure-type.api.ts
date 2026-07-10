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
import { ADMINISTRATIVE_INFRASTRUCTURE_BASE_URL } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.base-url';
import { ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(ADMINISTRATIVE_INFRASTRUCTURE_BASE_URL);

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
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(
        apiDto: InfrastructureTypeUpdateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(
        apiDto: InfrastructureTypeDeleteApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/${apiDto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(
        apiDto: InfrastructureTypeEnableApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/${apiDto.uniq_id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(
        apiDto: InfrastructureTypeDisableApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/${apiDto.uniq_id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
