import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { ApprovalRequestDto } from '../dtos/approval/approval-request.dto';
import { ApprovalResponseDto } from '../dtos/approval/approval-response.dto';
import { APPROVAL_ENDPOINTS } from '../endpoints/approval-endpoints';

@Injectable({
    providedIn: 'root',
})
export class ApprovalApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchApprovals(
        payload: ApprovalRequestDto,
        page: string
    ): Observable<ApprovalResponseDto> {
        const url = `${this.baseUrl}${APPROVAL_ENDPOINTS.APPROVALS.replace('{page}', page)}`;

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

        return this.http.get<ApprovalResponseDto>(url, { params });
    }
}
