import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { SLA_ENDPOINTS } from '@pages/sla/infrastructure/api/sla.endpoints';
import {
    SlaAlertChannelOptionsResponseApiDto,
    SlaAlertContactsResponseApiDto,
    SlaAlertUpdatePayloadApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/sla-alert-channel-response-api.dto';

@Injectable({ providedIn: 'root' })
export class SlaAlertChannelApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    readAll(
        search?: string,
        options?: FetchOptions
    ): Observable<SlaAlertContactsResponseApiDto> {
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<SlaAlertContactsResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.AGREEMENT_ALERT}`,
            {
                params: buildHttpParams({ search }),
                context,
            }
        );
    }

    readChannelOptions(): Observable<SlaAlertChannelOptionsResponseApiDto> {
        return this.http.get<SlaAlertChannelOptionsResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.CHANNEL_SELECT_FIELD}`
        );
    }

    update(
        payload: SlaAlertUpdatePayloadApiDto
    ): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.AGREEMENT_UPDATE}`,
            payload
        );
    }
}
