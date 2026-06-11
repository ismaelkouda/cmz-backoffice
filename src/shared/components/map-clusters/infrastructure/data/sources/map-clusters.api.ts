import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { INTERACTIVE_MAP_BASE_URL } from '@pages/interactive-map/infrastructure/api/interactive-map.base-url';
import { INTERACTIVE_MAP_ENDPOINTS } from '@pages/interactive-map/infrastructure/api/interactive-map.endpoints';
import { MapClustersFilterApiDto } from '@shared/components/map-clusters/infrastructure/api/dto/map-clusters-filter-api.dto';
import { MapClustersResponseApiDto } from '@shared/components/map-clusters/infrastructure/api/dto/map-clusters-response-api.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapClustersApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(INTERACTIVE_MAP_BASE_URL);

    execute(
        filter: MapClustersFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<MapClustersResponseApiDto> {
        const url = `${this.baseUrl}${INTERACTIVE_MAP_ENDPOINTS.MAP_CLUSTERS}?page=${page}`;
        const params = buildHttpParams(filter);

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<MapClustersResponseApiDto>(url, {
            params,
            context,
        });
    }
}
