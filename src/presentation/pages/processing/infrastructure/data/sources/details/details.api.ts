import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { DetailsFilterApiDto } from '@pages/processing/infrastructure/api/dto/details/details-filter-api.dto';
import { DetailsResponseApiDto } from '@pages/processing/infrastructure/api/dto/details/details-response-api.dto';
import { DetailsTakeApiDto } from '@pages/processing/infrastructure/api/dto/details/details-take-api.dto';
import { DetailsTreatApiDto } from '@pages/processing/infrastructure/api/dto/details/details-treat-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(PROCESSING_BASE_URL);

    execute(
        apiDto: DetailsFilterApiDto,
        options?: FetchOptions
    ): Observable<DetailsResponseApiDto> {
        const url = `${this.baseUrl}${apiDto.uniq_id}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<DetailsResponseApiDto>(url, {
            context,
        });
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
