import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DetailsFilterApiDto } from '@pages/finalization/infrastructure/api/dto/details/details-filter-api.dto';
import { DetailsFinalizeApiDto } from '@pages/finalization/infrastructure/api/dto/details/details-finalize-api.dto';
import { DetailsResponseApiDto } from '@pages/finalization/infrastructure/api/dto/details/details-response-api.dto';
import { DetailsTakeApiDto } from '@pages/finalization/infrastructure/api/dto/details/details-take-api.dto';
import { FINALIZATION_BASE_URL } from '@pages/finalization/infrastructure/api/finalization.base-url';
import { FINALIZATION_ENDPOINTS } from '@pages/finalization/infrastructure/api/finalization.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(FINALIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(apiDto: DetailsFilterApiDto): Observable<DetailsResponseApiDto> {
        const url = `${this.baseUrl}${apiDto.uniq_id}`;
        return this.http.get<DetailsResponseApiDto>(url);
    }

    take(apiDto: DetailsTakeApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${FINALIZATION_ENDPOINTS.DETAILS_REPORTS}/${apiDto.uniq_id}/take`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    finalize(
        apiDto: DetailsFinalizeApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${apiDto.uniq_id}/finalize`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }
}
