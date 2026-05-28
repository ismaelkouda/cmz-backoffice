import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { DetailsApproveApiDto } from '@pages/requests/infrastructure/api/dto/details/details-approve-api.dto';
import { DetailsFilterApiDto } from '@pages/requests/infrastructure/api/dto/details/details-filter-api.dto';
import { DetailsRejectApiDto } from '@pages/requests/infrastructure/api/dto/details/details-reject-api.dto';
import { DetailsResponseApiDto } from '@pages/requests/infrastructure/api/dto/details/details-response-api.dto';
import { DetailsTakeApiDto } from '@pages/requests/infrastructure/api/dto/details/details-take-api.dto';
import { REQUESTS_BASE_URL } from '@presentation/pages/requests/infrastructure/api/requests.base-url';
import { REQUESTS_ENDPOINTS } from '@presentation/pages/requests/infrastructure/api/requests.endpoints';
import { formDataBuilder } from '@shared/constants/formDataBuilder.constant';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DetailsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REQUESTS_BASE_URL);

    execute(apiDto: DetailsFilterApiDto): Observable<DetailsResponseApiDto> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.DETAILS_REQUESTS}/${apiDto.uniq_id}`;
        return this.http.get<DetailsResponseApiDto>(url);
    }

    take(apiDto: DetailsTakeApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.DETAILS_REQUESTS}/${apiDto.uniq_id}/take`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    approve(apiDto: DetailsApproveApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.DETAILS_REQUESTS}/${apiDto.uniq_id}/approve`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        const formData = formDataBuilder(payload);
        return this.http.post<SimpleResponseDto<void>>(url, formData);
    }

    reject(apiDto: DetailsRejectApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.DETAILS_REQUESTS}/${apiDto.uniq_id}/reject`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    private parseCoordinates(
        coordinatesString: string
    ): { latitude: number; longitude: number } | null {
        if (!coordinatesString) {
            return null;
        }

        const [lat, lng] = coordinatesString
            .split(',')
            .map((part) => Number.parseFloat(part.trim()));

        if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return null;
        }

        return { latitude: lat, longitude: lng };
    }
}
