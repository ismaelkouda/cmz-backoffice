import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { TasksFilterApiDto } from '@presentation/pages/finalization/infrastructure/api/dto/tasks/tasks-filter-api.dto';
import { TasksResponseApiDto } from '@presentation/pages/finalization/infrastructure/api/dto/tasks/tasks-response-api.dto';
import { FINALIZATION_BASE_URL } from '@presentation/pages/finalization/infrastructure/api/finalization.base-url';
import { FINALIZATION_ENDPOINTS } from '@presentation/pages/finalization/infrastructure/api/finalization.endpoints';

@Injectable({ providedIn: 'root' })
export class TasksApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(FINALIZATION_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: TasksFilterApiDto,
        page: string
    ): Observable<TasksResponseApiDto> {
        const url = `${this.baseUrl}${FINALIZATION_ENDPOINTS.TASKS}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<TasksResponseApiDto>(url, {
            params,
        });
    }
}
