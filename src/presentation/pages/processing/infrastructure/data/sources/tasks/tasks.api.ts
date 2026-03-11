import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TasksFilterApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-filter-api.dto';
import { TasksResponseApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-response-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { PROCESSING_ENDPOINTS } from '@pages/processing/infrastructure/api/processing.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(PROCESSING_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: TasksFilterApiDto,
        page: string
    ): Observable<TasksResponseApiDto> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.TASKS}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<TasksResponseApiDto>(url, {
            params,
        });
    }
}
