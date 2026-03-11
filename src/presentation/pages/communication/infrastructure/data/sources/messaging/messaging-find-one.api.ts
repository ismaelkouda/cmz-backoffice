import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { COMMUNICATION_BASE_URL } from '@pages/communication/infrastructure/api/communication.base-url';
import { COMMUNICATION_ENDPOINTS } from '@pages/communication/infrastructure/api/communication.endpoints';
import { MessagingFindOneFilterApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-find-one-filter-api.dto';
import { MessagingFindOneResponseApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-find-one-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(COMMUNICATION_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        dto?: MessagingFindOneFilterApiDto
    ): Observable<MessagingFindOneResponseApiDto> {
        console.log('dto: ', dto);
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${dto?.id}`;
        return this.http.get<MessagingFindOneResponseApiDto>(url);
    }
}
