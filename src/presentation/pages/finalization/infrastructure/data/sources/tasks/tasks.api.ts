import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { TasksFilterApiDto } from '@pages/finalization/infrastructure/api/dto/tasks/tasks-filter-api.dto';
import { TasksResponseApiDto } from '@pages/finalization/infrastructure/api/dto/tasks/tasks-response-api.dto';
import { FINALIZATION_BASE_URL } from '@pages/finalization/infrastructure/api/finalization.base-url';
import { FINALIZATION_ENDPOINTS } from '@pages/finalization/infrastructure/api/finalization.endpoints';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(FINALIZATION_BASE_URL);

    execute(
        filter: TasksFilterApiDto,
        page: string
    ): Observable<TasksResponseApiDto> {
        const url = `${this.baseUrl}${FINALIZATION_ENDPOINTS.TASKS}?page=${page}`;
        const params = buildHttpParams(filter, {
            arrayFormat: 'comma',
        });
        return this.http.get<TasksResponseApiDto>(url, {
            params,
        });
    }
}
