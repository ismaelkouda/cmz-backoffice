import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { TasksFilterApiDto } from '@pages/finalization/infrastructure/api/dto/tasks/tasks-filter-api.dto';
import { TasksResponseApiDto } from '@pages/finalization/infrastructure/api/dto/tasks/tasks-response-api.dto';
import { REPORT_API_URL } from '@core/config/config.tokens';
import { FINALIZATION_ENDPOINTS } from '@pages/finalization/infrastructure/api/finalization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl: string = inject(REPORT_API_URL);

    execute(
        filter: TasksFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<TasksResponseApiDto> {
        const url = `${this.baseUrl}${FINALIZATION_ENDPOINTS.TASKS}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<TasksResponseApiDto>(url, {
            params,
            context,
        });
    }
}
