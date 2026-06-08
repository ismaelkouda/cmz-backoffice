import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache.interceptor';
import { TasksFilterApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-filter-api.dto';
import { TasksResponseApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-response-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { PROCESSING_ENDPOINTS } from '@pages/processing/infrastructure/api/processing.endpoints';
import { FetchOptions } from '@shared/application/types/fetch-options';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(PROCESSING_BASE_URL);

    execute(
        filter: TasksFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<TasksResponseApiDto> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.TASKS}?page=${page}`;
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
