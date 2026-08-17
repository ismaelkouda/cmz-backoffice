import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { MessagingDeleteApiDto } from '@pages/communication/infrastructure//api/dto/messaging/messaging-delete-api.dto';
import { MessagingDisableApiDto } from '@pages/communication/infrastructure//api/dto/messaging/messaging-disable-api.dto';
import { MessagingEnableApiDto } from '@pages/communication/infrastructure//api/dto/messaging/messaging-enable-api.dto';
import { COMMUNICATION_ENDPOINTS } from '@pages/communication/infrastructure/api/communication.endpoints';
import { MessagingCreateApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-create-api.dto';
import { MessagingFilterApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-filter-api.dto';
import { MessagingResponseApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-response-api.dto';
import { MessagingUpdateApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-update-api.dto';
import { MessageResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    readAll(
        filter: MessagingFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<MessagingResponseApiDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<MessagingResponseApiDto>(url, {
            params,
            context,
        });
    }

    create(apiDto: MessagingCreateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    update(apiDto: MessagingUpdateApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<MessageResponseDto>(url, payload);
    }

    delete(apiDto: MessagingDeleteApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${apiDto}/delete`;
        return this.http.delete<MessageResponseDto>(url);
    }

    enable(apiDto: MessagingEnableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${apiDto}/enable`;
        return this.http.put<MessageResponseDto>(url, {});
    }

    disable(apiDto: MessagingDisableApiDto): Observable<MessageResponseDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${apiDto}/disable`;
        return this.http.put<MessageResponseDto>(url, {});
    }
}
