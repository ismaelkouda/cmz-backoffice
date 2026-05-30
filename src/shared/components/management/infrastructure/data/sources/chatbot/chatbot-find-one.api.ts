import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ChatbotFindOneFilterApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-find-one-filter-api.dto';
import { ChatbotFindOneResponseApiDto } from '@shared/components/management/infrastructure/api/dto/chatbot/chatbot-find-one-response-api.dto';
import { MANAGEMENT_BASE_URL } from '@shared/components/management/infrastructure/api/management.base-url';
import { MANAGEMENT_ENDPOINTS } from '@shared/components/management/infrastructure/api/management.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(MANAGEMENT_BASE_URL);

    read(
        dto?: ChatbotFindOneFilterApiDto
    ): Observable<ChatbotFindOneResponseApiDto> {
        const url = `${this.baseUrl}${MANAGEMENT_ENDPOINTS.CHATBOT}/${dto?.id}`;
        return this.http.get<ChatbotFindOneResponseApiDto>(url);
    }
}
