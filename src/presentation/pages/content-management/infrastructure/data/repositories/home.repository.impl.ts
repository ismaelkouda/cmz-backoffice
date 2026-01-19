import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HomeEntity } from '@presentation/pages/content-management/core/domain/entities/home.entity';
import { HomeRepository } from '@presentation/pages/content-management/core/domain/repositories/home.repository';
import { HomeFilter } from '@presentation/pages/content-management/core/domain/value-objects/home-filter.vo';
import { HomeMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home.mapper';
import { HomeApi } from '@presentation/pages/content-management/infrastructure/data/sources/home.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeRepositoryImpl extends HomeRepository {
    constructor(
        private readonly api: HomeApi,
        private readonly homeMapper: HomeMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchHome(
        filter: HomeFilter | null,
        page: string
    ): Observable<Paginate<HomeEntity>> {
        return this.api.fetchHome(filter?.toDto() ?? {}, page).pipe(
            map((response) => this.homeMapper.mapFromDto(response))
        );
    }

    getHomeById(id: string): Observable<HomeEntity> {
        return this.api
            .getHomeById(id)
            .pipe(map((dto) => this.homeMapper.toEntity(dto.data)));
    }

    createHome(payload: FormData): Observable<HomeEntity> {
        return this.api
            .createHome(payload)
            .pipe(map((dto) => this.homeMapper.toEntity(dto)));
    }

    updateHome(id: string, payload: FormData): Observable<HomeEntity> {
        return this.api
            .updateHome(id, payload)
            .pipe(map((dto) => this.homeMapper.toEntity(dto)));
    }

    deleteHome(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.deleteHome(id);
    }

    enableHome(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.enableHome(id);
    }

    disableHome(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.disableHome(id);
    }
}
