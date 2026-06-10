import { Injectable } from '@angular/core';
import { HomeCreateEntity } from '@pages/content-management/domain/entities/home/home-create.entity';
import { HomeDeleteEntity } from '@pages/content-management/domain/entities/home/home-delete.entity';
import { HomeDisableEntity } from '@pages/content-management/domain/entities/home/home-disable.entity';
import { HomeEnableEntity } from '@pages/content-management/domain/entities/home/home-enable.entity';
import { HomeFilterEntity } from '@pages/content-management/domain/entities/home/home-filter.entity';
import { HomeUpdateEntity } from '@pages/content-management/domain/entities/home/home-update.entity';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class HomeRepository {
    abstract readAll(
        entity: HomeFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<HomeEntity>>;
    abstract create(
        entity: HomeCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: HomeUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: HomeDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: HomeEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: HomeDisableEntity
    ): Observable<SimpleResponseDto<void>>;
}
