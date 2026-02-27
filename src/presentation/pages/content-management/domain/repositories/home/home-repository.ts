import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { HomeCreateEntity } from '@presentation/pages/content-management/domain/entities/home/home-create.entity';
import { HomeDeleteEntity } from '@presentation/pages/content-management/domain/entities/home/home-delete.entity';
import { HomeDisableEntity } from '@presentation/pages/content-management/domain/entities/home/home-disable.entity';
import { HomeEnableEntity } from '@presentation/pages/content-management/domain/entities/home/home-enable.entity';
import { HomeFilterEntity } from '@presentation/pages/content-management/domain/entities/home/home-filter.entity';
import { HomeUpdateEntity } from '@presentation/pages/content-management/domain/entities/home/home-update.entity';
import { HomeEntity } from '@presentation/pages/content-management/domain/entities/home/home.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class HomeRepository {
    abstract readAll(
        entity: HomeFilterEntity | null,
        page: string
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
