import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache.interceptor';
import { TasksFilterApiDto } from '@pages/requests/infrastructure/api/dto/tasks/tasks-filter-api.dto';
import { TasksResponseApiDto } from '@pages/requests/infrastructure/api/dto/tasks/tasks-response-api.dto';
import { REQUESTS_BASE_URL } from '@presentation/pages/requests/infrastructure/api/requests.base-url';
import { REQUESTS_ENDPOINTS } from '@presentation/pages/requests/infrastructure/api/requests.endpoints';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(REQUESTS_BASE_URL);

    execute(
        filter: TasksFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<TasksResponseApiDto> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.TASKS}?page=${page}`;
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
