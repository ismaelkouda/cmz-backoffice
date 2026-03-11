import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { SlideFindOneFilterApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-find-one-filter-api.dto';
import { SlideFindOneResponseApiDto } from '@pages/content-management/infrastructure/api/dto/slide/slide-find-one-response-api.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SlideFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    read(
        filter?: SlideFindOneFilterApiDto
    ): Observable<SlideFindOneResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.SLIDE}/${filter?.id}`;
        return this.http.get<SlideFindOneResponseApiDto>(url);
    }
}
