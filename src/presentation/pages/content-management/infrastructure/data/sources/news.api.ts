import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryItemDto } from '@presentation/pages/content-management/core/application/dtos/news/category-response.dto';
import { GetNewsByIdResponseDto } from '@presentation/pages/content-management/core/application/dtos/news/get-news-by-id-response.dto';
import { NewsRequestDto } from '@presentation/pages/content-management/core/application/dtos/news/news-request.dto';
import { NewsItemDto, NewsResponseDto } from '@presentation/pages/content-management/core/application/dtos/news/news-response.dto';
import { NEWS_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/data/endpoints/news-endpoints';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewsApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) { }

    getNewsById(id: string): Observable<GetNewsByIdResponseDto> {
        const url = `${this.baseUrl}${NEWS_ENDPOINTS.GET_BY_ID.replace('{id}', id)}`;
        return this.http.get<GetNewsByIdResponseDto>(url);
    }

    getCategory(): Observable<SimpleResponseDto<CategoryItemDto[]>> {
        const url = `${this.baseUrl}${NEWS_ENDPOINTS.GET_CATEGORY}`;
        return this.http.get<SimpleResponseDto<CategoryItemDto[]>>(url);
    }

    createNews(payload: FormData): Observable<NewsItemDto> {
        const url = `${this.baseUrl}${NEWS_ENDPOINTS.CREATE}`;
        return this.http.post<NewsItemDto>(url, payload);
    }

    updateNews(id: string, payload: FormData): Observable<NewsItemDto> {
        const url = `${this.baseUrl}${NEWS_ENDPOINTS.UPDATE.replace('{id}', id)}`;
        return this.http.post<NewsItemDto>(url, payload);
    }

    deleteNews(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${NEWS_ENDPOINTS.DELETE.replace('{id}', id)}`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enableNews(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${NEWS_ENDPOINTS.ENABLE.replace('{id}', id)}`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disableNews(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${NEWS_ENDPOINTS.DISABLE.replace('{id}', id)}`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    fetchNews(payload: NewsRequestDto, page: string): Observable<NewsResponseDto> {
        const url = `${this.baseUrl}${NEWS_ENDPOINTS.NEWS.replace('{page}', page)}`;

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

        return this.http.get<NewsResponseDto>(url, { params });
    }
}
