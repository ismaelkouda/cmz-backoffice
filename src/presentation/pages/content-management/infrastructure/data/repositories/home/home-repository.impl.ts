import { inject, Injectable } from '@angular/core';
import { HomeCreateEntity } from '@pages/content-management/domain/entities/home/home-create.entity';
import { HomeDeleteEntity } from '@pages/content-management/domain/entities/home/home-delete.entity';
import { HomeDisableEntity } from '@pages/content-management/domain/entities/home/home-disable.entity';
import { HomeEnableEntity } from '@pages/content-management/domain/entities/home/home-enable.entity';
import { HomeFilterEntity } from '@pages/content-management/domain/entities/home/home-filter.entity';
import { HomeUpdateEntity } from '@pages/content-management/domain/entities/home/home-update.entity';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { HomeRepository } from '@pages/content-management/domain/repositories/home/home-repository';
import { HomeCreateMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-create.mapper';
import { homeDeleteMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-delete.mapper';
import { homeDisableMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-disable.mapper';
import { homeEnableMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-enable.mapper';
import { homeFilterMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-filter.mapper';
import { HomeUpdateMapper } from '@pages/content-management/infrastructure/data/mappers/home/home-update.mapper';
import { HomeMapper } from '@pages/content-management/infrastructure/data/mappers/home/home.mapper';
import { HomeApi } from '@pages/content-management/infrastructure/data/sources/home/home.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HomeRepositoryImpl implements HomeRepository {
    private readonly api = inject(HomeApi);
    private readonly mapper = inject(HomeMapper);
    private readonly createMapper = inject(HomeCreateMapper);
    private readonly updateMapper = inject(HomeUpdateMapper);

    readAll(
        filter: HomeFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<HomeEntity>> {
        return this.api
            .readAll(homeFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: HomeCreateEntity): Observable<SimpleResponseDto<void>> {
        const dto = this.createMapper.mapEntityToApi(payload);
        return this.api.create(dto);
    }

    update(payload: HomeUpdateEntity): Observable<SimpleResponseDto<void>> {
        const dto = this.updateMapper.mapEntityToApi(payload);
        return this.api.update(dto);
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
