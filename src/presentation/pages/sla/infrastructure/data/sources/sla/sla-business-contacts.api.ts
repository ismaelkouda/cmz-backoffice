import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { SLA_ENDPOINTS } from '@pages/sla/infrastructure/api/sla.endpoints';
import {
    BusinessContactAddApiDto,
    BusinessContactFilterApiDto,
    BusinessContactFreeMembersResponseApiDto,
    BusinessContactResponseApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/business-contact-response-api.dto';
import {
    BusinessContactSlaFilterApiDto,
    BusinessContactAvailableSlaResponseApiDto,
    BusinessContactSlaIdsApiDto,
    BusinessContactSlaResponseApiDto,
    BusinessContactSlaRemoveIdsApiDto,
} from '@pages/sla/infrastructure/api/dto/sla/business-contact-sla-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlaBusinessContactsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    readAll(
        filter: BusinessContactFilterApiDto
    ): Observable<BusinessContactResponseApiDto> {
        return this.http.get<BusinessContactResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.SYSTEM_ALERT_CONTACTS}`,
            { params: buildHttpParams(filter) }
        );
    }

    freeMembers(): Observable<BusinessContactFreeMembersResponseApiDto> {
        return this.http.get<BusinessContactFreeMembersResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.SYSTEM_ALERT_CONTACTS}/available-users`
        );
    }

    add(dto: BusinessContactAddApiDto): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.SYSTEM_ALERT_CONTACTS}/add`,
            dto
        );
    }

    enable(id: string | number): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.BUSINESS_CONTACTS}/${id}/enable`,
            {}
        );
    }

    disable(id: string | number): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.BUSINESS_CONTACTS}/${id}/disable`,
            {}
        );
    }

    remove(id: string | number): Observable<MessageResponseDto> {
        return this.http.delete<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.SYSTEM_ALERT_CONTACTS}/${id}/remove`
        );
    }

    readManagement(
        id: string | number,
        filter: BusinessContactSlaFilterApiDto
    ): Observable<BusinessContactSlaResponseApiDto> {
        return this.http.get<BusinessContactSlaResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.SYSTEM_ALERT_CONTACTS}/${id}/business`,
            { params: buildHttpParams(filter) }
        );
    }

    readAvailableSlas(
        id: string | number
    ): Observable<BusinessContactAvailableSlaResponseApiDto> {
        return this.http.get<BusinessContactAvailableSlaResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.SYSTEM_ALERT_CONTACTS}/${id}/slas/available`
        );
    }

    readAssignedSlas(
        id: string | number
    ): Observable<BusinessContactSlaResponseApiDto> {
        const params = new HttpParams().set('contact_id', String(id));
        return this.http.get<BusinessContactSlaResponseApiDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.BUSINESS_CONTACTS}`,
            { params }
        );
    }

    reassignSlas(
        id: string | number,
        dto: BusinessContactSlaIdsApiDto
    ): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.SYSTEM_ALERT_CONTACTS}/${id}/reaffect-business`,
            dto
        );
    }

    affectSlas(
        id: string | number,
        dto: BusinessContactSlaIdsApiDto
    ): Observable<MessageResponseDto> {
        return this.http.post<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.SYSTEM_ALERT_CONTACTS}/${id}/affect-business`,
            dto
        );
    }

    removeSlas(
        id: string | number,
        dto: BusinessContactSlaRemoveIdsApiDto
    ): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${SLA_ENDPOINTS.REMOVE_BUSINESS}`,
            dto
        );
    }
}
