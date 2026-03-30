import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TasksFilterApiDto } from '@pages/requests/infrastructure/api/dto/tasks/tasks-filter-api.dto';
import { TasksResponseApiDto } from '@pages/requests/infrastructure/api/dto/tasks/tasks-response-api.dto';
import { REQUESTS_BASE_URL } from '@pages/requests/infrastructure/api/report-requests.base-url';
import { REQUESTS_ENDPOINTS } from '@pages/requests/infrastructure/api/report-requests.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(REQUESTS_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: TasksFilterApiDto,
        page: string
    ): Observable<TasksResponseApiDto> {
        const url = `${this.baseUrl}${REQUESTS_ENDPOINTS.TASKS}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<TasksResponseApiDto>(url, {
            params,
        });
    }
}
