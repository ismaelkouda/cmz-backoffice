import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { TasksActionsTypeFilterApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-type-filter-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { PROCESSING_ENDPOINTS } from '@pages/processing/infrastructure/api/processing.endpoints';
import { TasksActionsTypeResponseApiDto } from '@presentation/pages/processing/infrastructure/api/dto/tasks/tasks-actions-type-response-api.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsTypeApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(PROCESSING_BASE_URL);

    readAll(
        dto: TasksActionsTypeFilterApiDto,
        options?: FetchOptions
    ): Observable<TasksActionsTypeResponseApiDto> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.PROCESSING}/${dto.id}/report-types`;

        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<TasksActionsTypeResponseApiDto>(url, {
            context,
        });
    }
}
