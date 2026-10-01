import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';
import { SLA_ENDPOINTS } from '@pages/sla/infrastructure/api/sla.endpoints';
import {
    SlaEscalationContactFilterApiDto,
    SlaEscalationContactPayloadApiDto,
    SlaEscalationContactResponseApiDto,
    SlaEscalationContactsResponseApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/sla-escalation-contact-response-api.dto';

@Injectable({ providedIn: 'root' })
export class SlaEscalationContactsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    readAll(
        filter: SlaEscalationContactFilterApiDto,
        page: number
    ): Observable<SlaEscalationContactsResponseApiDto> {
        return this.http.get<SlaEscalationContactsResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.ESCALATION_CONTACTS}?page=${page}`,
            { params: buildHttpParams(filter) }
        );
    }

    findOne(id: string): Observable<SlaEscalationContactResponseApiDto> {
        return this.http.get<SlaEscalationContactResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.ESCALATION_CONTACTS}/${id}`
        );
    }

    create(
        payload: SlaEscalationContactPayloadApiDto
    ): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.ESCALATION_CONTACTS}/store`,
            payload
        );
    }

    update(
        id: string,
        payload: SlaEscalationContactPayloadApiDto
    ): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.ESCALATION_CONTACTS}/${id}/update`,
            payload
        );
    }

    enable(id: string): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.ESCALATION_CONTACTS}/${id}/enable`,
            {}
        );
    }

    disable(id: string): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.ESCALATION_CONTACTS}/${id}/disable`,
            {}
        );
    }

    remove(id: string): Observable<MessageResponseDto> {
        return this.http.delete<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.ESCALATION_CONTACTS}/${id}/delete`
        );
    }
}
