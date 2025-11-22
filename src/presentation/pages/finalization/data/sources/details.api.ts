import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
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
    ) {}

    fetchDetails(
        id: string,
        endPointType: EndPointType
    ): Observable<DetailsResponseDto> {
        let url: string;
        switch (endPointType) {
            case 'requests':
                url = `${this.baseUrl}${DETAILS_ENDPOINTS.DETAILS_QUALIFICATION.replace('{id}', id)}`;
                break;

            case 'reports-processing':
                url = `${this.baseUrl}${DETAILS_ENDPOINTS.DETAILS_PROCESSING.replace('{id}', id)}`;
                break;

            default:
                throw new Error('Endpoint non defini');
                break;
        }
        return this.http.get<DetailsResponseDto>(url);
    }
}
