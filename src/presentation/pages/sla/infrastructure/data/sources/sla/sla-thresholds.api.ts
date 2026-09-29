import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { Observable } from 'rxjs';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { SLA_ENDPOINTS } from '@pages/sla/infrastructure/api/sla.endpoints';
import { ReportTypeResponseApiDto } from '@pages/sla/infrastructure/api/dto/sla/report-type-response-api.dto';

@Injectable({ providedIn: 'root' })
export class SlaThresholdsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    reportTypes(
        slaType?: string,
        channel?: string
    ): Observable<ReportTypeResponseApiDto> {
        let params = new HttpParams();
        if (slaType) {
            params = params.set('sla_type', slaType);
        }
        if (channel) {
            params = params.set('channel', channel);
        }
        return this.http.get<ReportTypeResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_TYPES}`,
            { params }
        );
    }

    updateReportSla(
        id: number,
        payload: object
    ): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_TYPES}/${id}/update`,
            payload
        );
    }
}
