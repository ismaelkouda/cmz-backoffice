import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { InfrastructureFindOneFilterApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-find-one-filter-api.dto';
import { InfrastructureFindOneResponseApiDto } from '@pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-find-one-response-api.dto';
import { ADMINISTRATIVE_INFRASTRUCTURE_ENDPOINTS } from '@pages/administrative-infrastructure/infrastructure/api/administrative-infrastructure.endpoints';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { SETTINGS_API_URL } from '@core/config/config.tokens';

@Injectable({ providedIn: 'root' })
export class InfrastructureFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(SETTINGS_API_URL);

    execute(
        dto?: InfrastructureFindOneFilterApiDto,
        options?: FetchOptions
    ): Observable<InfrastructureFindOneResponseApiDto> {
        const params = dto?.id ? `/${dto.id}` : '';
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
