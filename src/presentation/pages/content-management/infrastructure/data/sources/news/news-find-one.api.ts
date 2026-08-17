import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { SETTINGS_API_URL } from '@core/config/config.tokens';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { NewsFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-find-one-filter-api.dto';
import { NewsFindOneResponseApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-find-one-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NewsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    read(
        filter?: NewsFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<NewsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${filter?.id}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<NewsFindOneResponseApiDto>(url, {
            context,
        });
    }
}
