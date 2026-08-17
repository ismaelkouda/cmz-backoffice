import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ADMINISTRATIVE_BOUNDARY_ENDPOINTS } from '../../../api/administrative-boundary.endpoints';
import { DepartmentsFindOneFilterApiDto } from '../../../api/dto/departments/departments-find-one-filter-api.dto';
import { DepartmentsFindOneResponseApiDto } from '../../../api/dto/departments/departments-find-one-response-api.dto';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    read(
        paramsDto: DepartmentsFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<DepartmentsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_BOUNDARY_ENDPOINTS.DEPARTMENTS}/${paramsDto.uniq_id}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<DepartmentsFindOneResponseApiDto>(url, {
            context,
        });
    }
}
