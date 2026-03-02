import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CONTENT_MANAGEMENT_BASE_URL } from '@presentation/pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/api/content-management.endpoints';
import { NewsFindOneFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/news/news-find-one-filter-api.dto';
import { NewsFindOneResponseApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/news/news-find-one-response-api.dto';

@Injectable({ providedIn: 'root' })
export class NewsFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        filter?: NewsFindOneFilterApiDto
    ): Observable<NewsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/${filter?.id}`;
        return this.http.get<NewsFindOneResponseApiDto>(url);
    }
}
