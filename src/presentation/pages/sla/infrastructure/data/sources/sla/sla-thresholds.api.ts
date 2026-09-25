import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { SLA_ENDPOINTS } from '@pages/sla/infrastructure/api/sla.endpoints';
import { ReportTypeResponseApiDto } from '@pages/sla/infrastructure/api/dto/sla/report-type-response-api.dto';
import { ReportSlaResponseApiDto } from '@pages/sla/infrastructure/api/dto/sla/report-sla-response-api.dto';
import { SlaOptionResponseApiDto } from '@pages/sla/infrastructure/api/dto/sla/sla-option-response-api.dto';

@Injectable({ providedIn: 'root' })
export class SlaThresholdsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    reportTypes(search?: string): Observable<ReportTypeResponseApiDto> {
        let params = new HttpParams();
        if (search) {
            params = params.set('search', search);
        }
        return this.http.get<ReportTypeResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_TYPES}`,
            { params }
        );
    }

    slaOptions(): Observable<SlaOptionResponseApiDto> {
        return this.http.get<SlaOptionResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.SLA_REFERENCES}`
        );
    }

    reportSlas(
        channel: string,
        reportTypeId: number
    ): Observable<ReportSlaResponseApiDto> {
        const params = new HttpParams()
            .set('channel', channel)
            .set('report_type_id', reportTypeId);
        return this.http.get<ReportSlaResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_SLA}`,
            { params }
        );
    }

    create(payload: object): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_SLA}/store`,
            payload
        );
    }
    update(id: number, payload: object): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_SLA}/${id}/update`,
            payload
        );
    }
    enable(id: number): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_SLA}/${id}/enable`,
            {}
        );
    }
    disable(id: number): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_SLA}/${id}/disable`,
            {}
        );
    }
    delete(id: number): Observable<MessageResponseDto> {
        return this.http.delete<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REPORT_SLA}/${id}/delete`
        );
    }
}
