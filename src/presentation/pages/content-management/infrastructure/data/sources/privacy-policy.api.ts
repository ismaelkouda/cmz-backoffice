import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetPrivacyPolicyByIdResponseDto } from '@presentation/pages/content-management/core/application/dtos/privacy-policy/get-privacy-policy-by-id-response.dto';
import { PrivacyPolicyRequestDto } from '@presentation/pages/content-management/core/application/dtos/privacy-policy/privacy-policy-request.dto';
import { PrivacyPolicyResponseDto } from '@presentation/pages/content-management/core/application/dtos/privacy-policy/privacy-policy-response.dto';
import { PRIVACY_POLICY_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/data/endpoints/privacy-policy-endpoints';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) { }

    fetchPrivacyPolicy(filter: PrivacyPolicyRequestDto, page: string): Observable<PrivacyPolicyResponseDto> {
        const url = `${this.baseUrl}${PRIVACY_POLICY_ENDPOINTS.PRIVACY_POLICY.replace('{page}', page)} `;

        const paramsObject = Object.entries(filter ?? {}).reduce<
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

        return this.http.get<PrivacyPolicyResponseDto>(url, { params });
    }

    getPrivacyPolicyById(id: string): Observable<GetPrivacyPolicyByIdResponseDto> {
        return this.http.get<GetPrivacyPolicyByIdResponseDto>(
            `${this.baseUrl}${PRIVACY_POLICY_ENDPOINTS.GET_BY_ID.replace('{id}', id)}`
        );
    }

    createPrivacyPolicy(payload: FormData): Observable<SimpleResponseDto<void>> {
        return this.http.post<SimpleResponseDto<void>>(
            `${this.baseUrl}${PRIVACY_POLICY_ENDPOINTS.CREATE}`,
            payload
        );
    }

    updatePrivacyPolicy(id: string, payload: FormData): Observable<SimpleResponseDto<void>> {
        return this.http.post<SimpleResponseDto<void>>(
            `${this.baseUrl}${PRIVACY_POLICY_ENDPOINTS.UPDATE.replace('{id}', id)}`,
            payload
        );
    }

    deletePrivacyPolicy(id: string): Observable<SimpleResponseDto<void>> {
        return this.http.delete<SimpleResponseDto<void>>(
            `${this.baseUrl}${PRIVACY_POLICY_ENDPOINTS.DELETE.replace('{id}', id)}`
        );
    }

    publishPrivacyPolicy(id: string): Observable<SimpleResponseDto<void>> {
        return this.http.put<SimpleResponseDto<void>>(
            `${this.baseUrl}${PRIVACY_POLICY_ENDPOINTS.PUBLISH.replace('{id}', id)}`,
            {}
        );
    }

    unpublishPrivacyPolicy(id: string): Observable<SimpleResponseDto<void>> {
        return this.http.put<SimpleResponseDto<void>>(
            `${this.baseUrl}${PRIVACY_POLICY_ENDPOINTS.UNPUBLISH.replace('{id}', id)}`,
            {}
        );
    }
}
