
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HomeRequestDto } from '@presentation/pages/content-management/core/application/dtos/home/home-request.dto';
import { HomeItemDto, HomeResponseDto } from '@presentation/pages/content-management/core/application/dtos/home/home-response.dto';
import { HOME_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/data/endpoints/home-endpoints';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HomeApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) { }

    fetchHome(payload: HomeRequestDto, page: string): Observable<HomeResponseDto> {
        const url = `${this.baseUrl}${HOME_ENDPOINTS.HOME.replace('{page}', page)} `;

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

        return this.http.get<HomeResponseDto>(url, { params });
    }

    getHomeById(id: string): Observable<SimpleResponseDto<HomeItemDto>> {
        const url = `${this.baseUrl}${HOME_ENDPOINTS.GET_BY_ID.replace('{id}', id)} `;
        return this.http.get<SimpleResponseDto<HomeItemDto>>(url);
    }

    createHome(payload: FormData): Observable<HomeItemDto> {
        const url = `${this.baseUrl}${HOME_ENDPOINTS.CREATE} `;
        return this.http.post<HomeItemDto>(url, payload);
    }

    updateHome(id: string, payload: FormData): Observable<HomeItemDto> {
        const url = `${this.baseUrl}${HOME_ENDPOINTS.UPDATE.replace('{id}', id)} `;
        return this.http.post<HomeItemDto>(url, payload);
    }

    deleteHome(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${HOME_ENDPOINTS.DELETE.replace('{id}', id)} `;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enableHome(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${HOME_ENDPOINTS.ENABLE.replace('{id}', id)} `;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disableHome(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${HOME_ENDPOINTS.DISABLE.replace('{id}', id)} `;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
