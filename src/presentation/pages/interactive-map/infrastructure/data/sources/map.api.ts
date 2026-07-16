import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { MapResponseDto } from '../../api/dto/map/map-response.dto';
import { INTERACTIVE_MAP_ENDPOINTS } from '@pages/interactive-map/infrastructure/api/interactive-map.endpoints';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({
    providedIn: 'root',
})
export class MapApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(SETTINGS_API_URL);

    getMap(): Observable<MapResponseDto> {
        const url = `${this.baseUrl}${INTERACTIVE_MAP_ENDPOINTS.MAP}`;

        return this.http.get<MapResponseDto>(url);
    }
}
