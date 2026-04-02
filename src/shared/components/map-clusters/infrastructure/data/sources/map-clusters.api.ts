import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { INTERACTIVE_MAP_BASE_URL } from '@pages/interactive-map/infrastructure/api/interactive-map.base-url';
import { INTERACTIVE_MAP_ENDPOINTS } from '@pages/interactive-map/infrastructure/api/interactive-map.endpoints';
import { MapClustersFilterApiDto } from '@shared/components/map-clusters/infrastructure/api/dto/map-clusters-filter-api.dto';
import { MapClustersResponseApiDto } from '@shared/components/map-clusters/infrastructure/api/dto/map-clusters-response-api.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapClustersApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(INTERACTIVE_MAP_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: MapClustersFilterApiDto,
        page: string
    ): Observable<MapClustersResponseApiDto> {
        const url = `${this.baseUrl}${INTERACTIVE_MAP_ENDPOINTS.MAP_CLUSTERS}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<MapClustersResponseApiDto>(url, {
            params,
        });
    }
}
