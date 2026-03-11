import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { HomeFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-find-one-filter-api.dto';
import { HomeFindOneResponseApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-find-one-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        filter?: HomeFindOneFilterApiDto
    ): Observable<HomeFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.HOME}/${filter?.id}`;
        return this.http.get<HomeFindOneResponseApiDto>(url);
    }
}
