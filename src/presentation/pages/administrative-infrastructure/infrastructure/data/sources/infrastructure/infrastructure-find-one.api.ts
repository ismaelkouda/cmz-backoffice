import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { InfrastructureFindOneFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-find-one-filter-api.dto';
import { InfrastructureFindOneResponseApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-find-one-response-api.dto';
import { ADMINISTRATIVE_INFRASTRUCTURE_BASE_URL } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.base-url';
import { ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InfrastructureFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(ADMINISTRATIVE_INFRASTRUCTURE_BASE_URL);

    execute(
        filter?: InfrastructureFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<InfrastructureFindOneResponseApiDto> {
        const params = filter?.id ? `/${filter.id}` : '';
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE}${params}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<InfrastructureFindOneResponseApiDto>(url, {
            context,
        });
    }
}
