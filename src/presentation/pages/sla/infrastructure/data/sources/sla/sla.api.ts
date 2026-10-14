import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SlaFilterApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-filter-api.dto';
import { SlaResponseApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-response-api.dto';
import { SLA_ENDPOINTS } from '@pages/sla/infrastructure/api/sla.endpoints';
import { SlaCreateApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-create-api.dto';
import { SlaUpdateApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-update-api.dto';
import { SlaEnableApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-enable-api.dto';
import { SlaDisableApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-disable-api.dto';
import { SlaDeleteApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-delete-api.dto';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlaApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    execute(
        filter: SlaFilterApiDto,
        options?: FetchOptions
    ): Observable<SlaResponseApiDto> {
        const url = `${this.baseUrl}${SLA_ENDPOINTS.LIST}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<SlaResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(apiDto: SlaCreateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${SLA_ENDPOINTS.CREATE}`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    update(apiDto: SlaUpdateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${SLA_ENDPOINTS.UPDATE}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    enable(apiDto: SlaEnableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${SLA_ENDPOINTS.ENABLE}/${apiDto.id}/enable`;
        return this.http.put<MessageResponseDto>(url, {});
    }

    disable(apiDto: SlaDisableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${SLA_ENDPOINTS.DISABLE}/${apiDto.id}/disable`;
        return this.http.put<MessageResponseDto>(url, {});
    }

    delete(apiDto: SlaDeleteApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${SLA_ENDPOINTS.DELETE}/${apiDto.id}/delete`;
        return this.http.delete<MessageResponseDto>(url);
    }
}
