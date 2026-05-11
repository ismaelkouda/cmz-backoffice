import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { REPORT_API_URL } from '@core/config/config.tokens';
import { AllFilterApiDto } from '@pages/requests/infrastructure/api/dto/all/all-filter-api.dto';
import { AllResponseApiDto } from '@pages/requests/infrastructure/api/dto/all/all-response-api.dto';
import { REQUESTS_ENDPOINTS } from '@presentation/pages/requests/infrastructure/api/requests.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AllApi {
    private readonly http = inject(HttpClient);
    private readonly reportApiUrl = inject(REPORT_API_URL);

    execute(
        filter: AllFilterApiDto,
        page: string
    ): Observable<AllResponseApiDto> {
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });

        return this.http.get<AllResponseApiDto>(
            `${this.reportApiUrl}${REQUESTS_ENDPOINTS.ALL}`,
            { params: { ...params, page } }
        );
    }
}
