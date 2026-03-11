import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { DetailsFilterApiDto } from '@pages/processing/infrastructure/api/dto/details/details-filter-api.dto';
import { DetailsResponseApiDto } from '@pages/processing/infrastructure/api/dto/details/details-response-api.dto';
import { DetailsTakeApiDto } from '@pages/processing/infrastructure/api/dto/details/details-take-api.dto';
import { DetailsTreatApiDto } from '@pages/processing/infrastructure/api/dto/details/details-treat-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(PROCESSING_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(apiDto: DetailsFilterApiDto): Observable<DetailsResponseApiDto> {
        const url = `${this.baseUrl}${apiDto.uniq_id}`;
        return this.http.get<DetailsResponseApiDto>(url);
    }

    take(apiDto: DetailsTakeApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${apiDto.uniq_id}/take`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    treat(apiDto: DetailsTreatApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${apiDto.uniq_id}/process`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }
}
