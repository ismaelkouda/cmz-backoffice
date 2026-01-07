import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { SlideRequestDto } from '../../../core/application/dtos/slide/slide-request.dto';
import {
    SlideItemDto,
    SlideResponseDto,
} from '../../../core/application/dtos/slide/slide-response.dto';
import { SLIDE_ENDPOINTS } from '../endpoints/slide-endpoints';

@Injectable({
    providedIn: 'root',
})
export class SlideApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchSlides(
        payload: SlideRequestDto,
        page: string
    ): Observable<SlideResponseDto> {
        const url = `${this.baseUrl}${SLIDE_ENDPOINTS.SLIDE.replace('{page}', page)}`;

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

        return this.http.get<SlideResponseDto>(url, { params });
    }

    getSlideById(id: string): Observable<SimpleResponseDto<SlideItemDto>> {
        const url = `${this.baseUrl}${SLIDE_ENDPOINTS.GET_BY_ID.replace('{id}', id)}`;
        return this.http.get<SimpleResponseDto<SlideItemDto>>(url);
    }

    createSlide(formData: FormData): Observable<SlideItemDto> {
        const url = `${this.baseUrl}${SLIDE_ENDPOINTS.CREATE}`;
        return this.http.post<SlideItemDto>(url, formData);
    }

    updateSlide(id: string, formData: FormData): Observable<SlideItemDto> {
        const url = `${this.baseUrl}${SLIDE_ENDPOINTS.UPDATE.replace('{id}', id)}`;
        return this.http.post<SlideItemDto>(url, formData);
    }

    deleteSlide(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SLIDE_ENDPOINTS.DELETE.replace('{id}', id)}`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enableSlide(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SLIDE_ENDPOINTS.ENABLE.replace('{id}', id)}`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disableSlide(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${SLIDE_ENDPOINTS.DISABLE.replace('{id}', id)}`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
