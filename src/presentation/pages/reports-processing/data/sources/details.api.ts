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

    fetchDetails(id: string): Observable<DetailsResponseDto> {
        const url = `${this.baseUrl}${DETAILS_ENDPOINTS.DETAILS.replace('{id}', id)}`;
        return this.http.get<DetailsResponseDto>(url);
    }
}
