import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { SLA_ENDPOINTS } from '@pages/sla/infrastructure/api/sla.endpoints';
import { ReportTypeResponseApiDto } from '@pages/sla/infrastructure/api/dto/sla/report-type-response-api.dto';
import { ChannelSelectFieldResponseApiDto } from '@pages/sla/infrastructure/api/dto/sla/channel-select-field-response-api.dto';
import { SlaThresholdUpdateApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-threshold-update-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { HttpContext } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class SlaThresholdsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    reportTypes(
        slaType?: string,
        channel?: string,
        options?: FetchOptions
    ): Observable<ReportTypeResponseApiDto> {
        let params = new HttpParams();
        if (slaType) {
            params = params.set('sla_type', slaType);
        }
        if (channel) {
            params = params.set('channel_id', channel);
        }
        return this.http.get<ReportTypeResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_TYPES}`,
            {
                params,
                context: new HttpContext().set(
                    BYPASS_CACHE,
                    options?.forceRefresh ?? false
                ),
            }
        );
    }

    channelOptions(): Observable<ChannelSelectFieldResponseApiDto> {
        return this.http.get<ChannelSelectFieldResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.CHANNEL_SELECT_FIELD}`
        );
    }

    updateReportSla(
        payload: SlaThresholdUpdateApiDto
    ): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_TYPES}/${payload.id}/update`,
            payload
        );
    }
}
