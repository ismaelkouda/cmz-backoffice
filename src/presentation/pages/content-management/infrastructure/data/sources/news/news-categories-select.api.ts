import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { NewsCategoriesSelectResponseApiDto } from '@pages/content-management/infrastructure/api/dto/news/news-categories-select-response-api.dto';
import { Observable } from 'rxjs';

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
