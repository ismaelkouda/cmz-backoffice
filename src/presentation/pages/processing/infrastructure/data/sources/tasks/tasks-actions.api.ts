import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TasksActionsCreateApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-create-api.dto';
import { TasksActionsDeleteApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-delete-api.dto';
import { TasksActionsFilterApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-filter-api.dto';
import { TasksActionsResponseApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-response-api.dto';
import { TasksActionsUpdateApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-update-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { PROCESSING_ENDPOINTS } from '@pages/processing/infrastructure/api/processing.endpoints';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(PROCESSING_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: TasksActionsFilterApiDto,
        page: string
    ): Observable<TasksActionsResponseApiDto> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.PROCESSING}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<TasksActionsResponseApiDto>(url, {
            params,
        });
    }

    create(
        apiDto: TasksActionsCreateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.PROCESSING}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(
        apiDto: TasksActionsUpdateApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.PROCESSING}/${apiDto.uniq_id}/update`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(
        apiDto: TasksActionsDeleteApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.PROCESSING}/${apiDto.uniq_id}/delete`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
