import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TasksActionsTypeResponseApiDto } from '@pages/processing/infrastructure/api/dto/tasks/tasks-actions-type-api.dto';
import { PROCESSING_BASE_URL } from '@pages/processing/infrastructure/api/processing.base-url';
import { PROCESSING_ENDPOINTS } from '@pages/processing/infrastructure/api/processing.endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TasksActionsTypeApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(PROCESSING_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(): Observable<TasksActionsTypeResponseApiDto> {
        const url = `${this.baseUrl}${PROCESSING_ENDPOINTS.PROCESSING}/types`;
        return this.http.get<TasksActionsTypeResponseApiDto>(url);
    }
}
