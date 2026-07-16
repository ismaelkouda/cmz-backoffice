import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { InfrastructureTypeFindOneFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-find-one-filter-api.dto';
import { InfrastructureTypeFindOneResponseApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-find-one-response-api.dto';
import { ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class InfrastructureTypeFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    execute(
        filter?: InfrastructureTypeFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<InfrastructureTypeFindOneResponseApiDto> {
        const params = filter?.id ? `/${filter.id}` : '';
        const url = `${this.baseUrl}${ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS.INFRASTRUCTURE_TYPE}${params}`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<InfrastructureTypeFindOneResponseApiDto>(url, {
            context,
        });
    }
}
