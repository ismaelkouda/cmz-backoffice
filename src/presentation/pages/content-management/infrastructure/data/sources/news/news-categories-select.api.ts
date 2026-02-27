import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CONTENT_MANAGEMENT_BASE_URL } from '@presentation/pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/api/content-management.endpoints';
import { NewsCategoriesSelectResponseApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/news/news-categories-select-response-api.dto';

@Injectable({
    providedIn: 'root',
})
export class NewsCategoriesSelectApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL)
        private readonly baseUrl: string
    ) {}

    readAll(): Observable<NewsCategoriesSelectResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.NEWS}/selected-field`;

        return this.http.get<NewsCategoriesSelectResponseApiDto>(url);
    }
}
