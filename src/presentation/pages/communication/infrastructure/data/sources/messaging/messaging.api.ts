import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessagingDeleteApiDto } from '@pages/communication/infrastructure//api/dto/messaging/messaging-delete-api.dto';
import { MessagingDisableApiDto } from '@pages/communication/infrastructure//api/dto/messaging/messaging-disable-api.dto';
import { MessagingEnableApiDto } from '@pages/communication/infrastructure//api/dto/messaging/messaging-enable-api.dto';
import { COMMUNICATION_BASE_URL } from '@pages/communication/infrastructure/api/communication.base-url';
import { COMMUNICATION_ENDPOINTS } from '@pages/communication/infrastructure/api/communication.endpoints';
import { MessagingCreateApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-create-api.dto';
import { MessagingFilterApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-filter-api.dto';
import { MessagingResponseApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-response-api.dto';
import { MessagingUpdateApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-update-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(COMMUNICATION_BASE_URL);

    readAll(
        filter: MessagingFilterApiDto,
        page: string
    ): Observable<MessagingResponseApiDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        console.log('params: ', params);
        return this.http.get<MessagingResponseApiDto>(url, {
            params,
        });
    }

    create(apiDto: MessagingCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(apiDto: MessagingUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(apiDto: MessagingDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${apiDto}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(apiDto: MessagingEnableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${apiDto}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(
        apiDto: MessagingDisableApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${apiDto}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
