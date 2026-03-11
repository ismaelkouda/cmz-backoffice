import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { COMMUNICATION_BASE_URL } from '@pages/communication/infrastructure/api/communication.base-url';
import { COMMUNICATION_ENDPOINTS } from '@pages/communication/infrastructure/api/communication.endpoints';
import { NotificationsFilterApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-filter-api.dto';
import { NotificationsResponseApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-response-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(COMMUNICATION_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: NotificationsFilterApiDto,
        page: string
    ): Observable<NotificationsResponseApiDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.NOTIFICATIONS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<NotificationsResponseApiDto>(url, { params });
    }

    readAll(): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.NOTIFICATIONS}/read-all`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
