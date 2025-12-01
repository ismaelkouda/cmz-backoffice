import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { MessagingRequestDto } from '../dtos/messaging-request.dto';
import { MessagingResponseDto } from '../dtos/messaging-response.dto';
import { MESSAGING_ENDPOINTS } from '../endpoint/messaging.endpoints';

@Injectable({ providedIn: 'root' })
export class MessagingApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchMessages(
        filter: MessagingRequestDto,
        page: string
    ): Observable<MessagingResponseDto> {
        const url = `${this.baseUrl}/${MESSAGING_ENDPOINTS.GET_MESSAGES}`;

        let params = new HttpParams().set('page', page);

        Object.entries(filter).forEach(([key, value]) => {
            if (value) {
                params = params.set(key, value);
            }
        });

        return this.http.get<MessagingResponseDto>(url, { params });
    }
}
