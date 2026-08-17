import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { InfrastructureCreateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-create-api.dto';
import { InfrastructureDeleteApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-delete-api.dto';
import { InfrastructureFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-filter-api.dto';
import { InfrastructureResponseApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-response-api.dto';
import { InfrastructureUpdateApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-update-api.dto';
import { ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.endpoints';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class InfrastructureApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    readAll(
        dto: InfrastructureFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<InfrastructureResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE}?page=${page}`;

        const params = buildHttpParams(dto);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<InfrastructureResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(dto: InfrastructureCreateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE}/store`;
        const payload = buildHttpPayload(dto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    update(dto: InfrastructureUpdateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE}/${dto.id}/update`;
        const payload = buildHttpPayload(dto, ['id']);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    delete(dto: InfrastructureDeleteApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE}/${dto.uniq_id}/delete`;
        return this.http.delete<MessageResponseDto>(url);
    }
}
