import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { NewsFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-find-one-filter-api.dto';
import { NewsFindOneResponseApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-find-one-response-api.dto';
import { Observable } from 'rxjs';

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
