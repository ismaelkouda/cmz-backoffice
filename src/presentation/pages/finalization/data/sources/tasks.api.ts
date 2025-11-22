import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { TasksRequestDto } from '../dtos/tasks/tasks-request.dto';
import { TasksResponseDto } from '../dtos/tasks/tasks-response.dto';
import { TASKS_ENDPOINTS } from '../endpoint/tasks-endpoints';

@Injectable({
    providedIn: 'root',
})
export class TasksApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchTasks(
        payload: TasksRequestDto,
        page: string
    ): Observable<TasksResponseDto> {
        const url = `${this.baseUrl}${TASKS_ENDPOINTS.TASKS.replace('{page}', page)}`;

        const paramsObject = Object.entries(payload ?? {}).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        const params =
            Object.keys(paramsObject).length > 0
                ? new HttpParams({ fromObject: paramsObject })
                : undefined;

        return this.http.get<TasksResponseDto>(url, { params });
    }
}
