import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { COMMUNICATION_ENDPOINTS } from '@pages/communication/infrastructure/api/communication.endpoints';
import { MessagingFindOneFilterApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-find-one-filter-api.dto';
import { MessagingFindOneResponseApiDto } from '@pages/communication/infrastructure/api/dto/messaging/messaging-find-one-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(AUTH_API_URL);

    read(
        dto?: MessagingFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<MessagingFindOneResponseApiDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.MESSAGING}/${dto?.id}`;
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<MessagingFindOneResponseApiDto>(url, {
            context,
        });
    }
}
