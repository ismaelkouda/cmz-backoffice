/* import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { AccessLogsEndpoint } from '../constants/access-logs-endpoints.constant';
import { AccessLogsRequestDto } from '../dtos/access-logs-request.dto';
import { AccessLogsResponseDto } from '../dtos/access-logs-response.dto';

@Injectable({ providedIn: 'root' })
export class AccessLogsApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(private http: HttpClient, private envService: EnvService) { }

    fetchAccessLogs(
        payload: AccessLogsRequestDto,
        page: string
    ): Observable<AccessLogsResponseDto> {
        const url = `${this.baseUrl}${AccessLogsEndpoint.FETCH.replace('{page}', page)}`;
        return this.http.post<AccessLogsResponseDto>(url, payload);
    }
}
 */