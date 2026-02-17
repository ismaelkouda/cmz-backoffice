import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { TasksFilterApiDto } from '@presentation/pages/processing/infrastructure/api/dto/tasks/tasks-filter-api.dto';
import { TasksResponseApiDto } from '@presentation/pages/processing/infrastructure/api/dto/tasks/tasks-response-api.dto';
import { PROCESSING_BASE_URL } from '@presentation/pages/processing/infrastructure/api/processing.base-url';
import { PROCESSING_ENDPOINTS } from '@presentation/pages/processing/infrastructure/api/processing.endpoints';

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
