import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HomeRequestDto } from '@presentation/pages/content-management/core/application/dtos/home/home-request.dto';
import {
    HomeItemDto,
    HomeResponseDto,
} from '@presentation/pages/content-management/core/application/dtos/home/home-response.dto';
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

    fetchHome(
        payload: HomeRequestDto,
        page: string
    ): Observable<HomeResponseDto> {
        console.log("page", page);
        const url = `${this.baseUrl}${HOME_ENDPOINTS.HOME.replace('{page}', page)}`;

        const params = this.createHttpParams(payload);

        return this.http.get<HomeResponseDto>(url, { params });
    }

    private createHttpParams(payload: any): HttpParams {
        let params = new HttpParams();

        if (payload) {
            Object.entries(payload).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    if (value instanceof Date) {
                        params = params.set(key, value.toISOString());
                    } else {
                        params = params.set(key, String(value));
                    }
                }
            });
        }

        return params;
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
