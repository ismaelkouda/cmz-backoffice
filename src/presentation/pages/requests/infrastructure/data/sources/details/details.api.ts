import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';

import { DetailsApproveApiDto } from '@presentation/pages/requests/infrastructure/api/dto/details/details-approve-api.dto';
import { DetailsFilterApiDto } from '@presentation/pages/requests/infrastructure/api/dto/details/details-filter-api.dto';
import { DetailsRejectApiDto } from '@presentation/pages/requests/infrastructure/api/dto/details/details-reject-api.dto';
import { DetailsResponseApiDto } from '@presentation/pages/requests/infrastructure/api/dto/details/details-response-api.dto';
import { DetailsTakeApiDto } from '@presentation/pages/requests/infrastructure/api/dto/details/details-take-api.dto';
import { REQUESTS_BASE_URL } from '@presentation/pages/requests/infrastructure/api/report-requests.base-url';
import { REQUESTS_ENDPOINTS } from '@presentation/pages/requests/infrastructure/api/report-requests.endpoints';

@Injectable({ providedIn: 'root' })
export class DetailsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REQUESTS_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(apiDto: DetailsFilterApiDto): Observable<DetailsResponseApiDto> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.DETAILS_REQUESTS}/${apiDto.uniq_id}`;
        return this.http.get<DetailsResponseApiDto>(url);
    }

    take(apiDto: DetailsTakeApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.DETAILS_REQUESTS}/take/${apiDto.uniq_id}`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    approve(apiDto: DetailsApproveApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.DETAILS_REQUESTS}/approve/${apiDto.uniq_id}`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    reject(apiDto: DetailsRejectApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.DETAILS_REQUESTS}/reject/${apiDto.uniq_id}`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }
}
