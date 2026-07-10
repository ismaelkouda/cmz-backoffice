import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeSelectResponseApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-select-api.dto';
import { ADMINISTRATIVE_INFRASTRUCTURE_BASE_URL } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.base-url';
import { ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeSelectApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(ADMINISTRATIVE_INFRASTRUCTURE_BASE_URL);

    readAll(
        options?: FetchOptions
    ): Observable<InfrastructureTypeSelectResponseApiDto> {
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}/select-field`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<InfrastructureTypeSelectResponseApiDto>(url, {
            context,
        });
    }
}
