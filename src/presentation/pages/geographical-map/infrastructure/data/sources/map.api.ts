import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MapResponseDto } from '../../api/dto/map/map-response.dto';
import { GEOGRAPHICAL_MAP_API_BASE_URL } from '../../api/geographical-map.config';
import { GEOGRAPHICAL_MAP_ENDPOINTS } from '../../api/geographical-map.endpoints';

@Injectable({
    providedIn: 'root',
})
export class MapApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(GEOGRAPHICAL_MAP_API_BASE_URL) private readonly baseUrl: string
    ) {}

    getMap(): Observable<MapResponseDto> {
        const url = `${this.baseUrl}${GEOGRAPHICAL_MAP_ENDPOINTS.MAP}`;

        return this.http.get<MapResponseDto>(url);
    }
}
