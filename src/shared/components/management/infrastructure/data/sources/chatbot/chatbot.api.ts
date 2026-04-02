import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ChatbotDeleteApiDto } from '@shared/components/management/infrastructure//api/dto/chatbot/chatbot-delete-api.dto';
import { ChatbotDisableApiDto } from '@shared/components/management/infrastructure//api/dto/chatbot/chatbot-disable-api.dto';
import { ChatbotEnableApiDto } from '@shared/components/management/infrastructure//api/dto/chatbot/chatbot-enable-api.dto';
import { ChatbotCreateApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-create-api.dto';
import { ChatbotFilterApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-filter-api.dto';
import { ChatbotResponseApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-response-api.dto';
import { ChatbotUpdateApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-update-api.dto';
import { MANAGEMENT_BASE_URL } from '@shared/components/management/infrastructure/api/management.base-url';
import { MANAGEMENT_ENDPOINTS } from '@shared/components/management/infrastructure/api/management.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: ChatbotFilterApiDto,
        page: string
    ): Observable<ChatbotResponseApiDto> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.CHATBOT}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<ChatbotResponseApiDto>(url, {
            params,
        });
    }

    create(apiDto: ChatbotCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.CHATBOT}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(apiDto: ChatbotUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.CHATBOT}/${apiDto.id}/update`;
        const payload = buildHttpPayload(apiDto, ['id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(apiDto: ChatbotDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.CHATBOT}/${apiDto}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(apiDto: ChatbotEnableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.CHATBOT}/${apiDto}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(apiDto: ChatbotDisableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.CHATBOT}/${apiDto}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
