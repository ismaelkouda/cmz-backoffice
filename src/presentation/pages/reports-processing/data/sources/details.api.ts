import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { DetailsFilter } from '../../domain/value-objects/details-filter.vo';
import { DetailsResponseDto } from '../dtos/details/details-response.dto';
import { DETAILS_ENDPOINTS } from '../endpoint/details-endpoints';

@Injectable({
    providedIn: 'root',
})
export class DetailsApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) { }

    fetchDetails(
        filter: DetailsFilter,
        endPointType?: EndPointType
    ): Observable<DetailsResponseDto> {
        let url: string;
        switch (endPointType) {
            case 'requests':
                url = `${this.baseUrl}${DETAILS_ENDPOINTS.DETAILS_REQUESTS.replace('{id}', filter.id)}`;
                break;

            case 'reports-processing':
            case 'reports-finalization':
                url = `${this.baseUrl}${DETAILS_ENDPOINTS.DETAILS_REPORTS.replace('{id}', filter.id)}`;
                break;

            default:
                throw new Error('Endpoint non defini');
        }
        return this.http.get<DetailsResponseDto>(url);
    }
}
