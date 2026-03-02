import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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
import { HomeRepository } from '@presentation/pages/content-management/domain/repositories/home/home-repository';
import { homeCreateMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home/home-create.mapper';
import { homeDeleteMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home/home-delete.mapper';
import { homeDisableMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home/home-disable.mapper';
import { homeEnableMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home/home-enable.mapper';
import { homeFilterMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home/home-filter.mapper';
import { homeUpdateMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home/home-update.mapper';
import { HomeMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/home/home.mapper';
import { HomeApi } from '@presentation/pages/content-management/infrastructure/data/sources/home/home.api';

@Injectable({
    providedIn: 'root',
})
export class HomeRepositoryImpl implements HomeRepository {
    private readonly api = inject(HomeApi);
    private readonly mapper = inject(HomeMapper);

    readAll(
        filter: HomeFilterEntity,
        page: string
    ): Observable<Paginate<HomeEntity>> {
        return this.api
            .readAll(homeFilterMapper(filter), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: HomeCreateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.create(homeCreateMapper(payload));
    }

    update(payload: HomeUpdateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.update(homeUpdateMapper(payload));
    }

    delete(entity: HomeDeleteEntity): Observable<SimpleResponseDto<void>> {
        return this.api.delete(homeDeleteMapper(entity));
    }

    enable(entity: HomeEnableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.enable(homeEnableMapper(entity));
    }

    disable(entity: HomeDisableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.disable(homeDisableMapper(entity));
    }
}
