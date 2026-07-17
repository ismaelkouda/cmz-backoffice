import { inject, Injectable } from '@angular/core';
import { HomeDeleteDto } from '@pages/content-management/application/dto/home/home-delete.dto';
import { HomeDisableDto } from '@pages/content-management/application/dto/home/home-disable.dto';
import { HomeEnableDto } from '@pages/content-management/application/dto/home/home-enable.dto';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { HomeCreateProps } from '@pages/content-management/domain/interfaces/home/home-create-props.interface';
import { HomeUpdateProps } from '@pages/content-management/domain/interfaces/home/home-update-props.interface';
import { HomeRepository } from '@pages/content-management/domain/repositories/home/home-repository';
import { HomeFilterVo } from '@pages/content-management/domain/value-objects/home/home-filter.vo';
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
        filter: HomeFilterVo,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<HomeEntity>> {
        return this.api
            .readAll(homeFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: HomeCreateProps): Observable<SimpleResponseDto<void>> {
        const dto = this.createMapper.mapEntityToApi(payload);
        return this.api.create(dto);
    }

    update(payload: HomeUpdateProps): Observable<SimpleResponseDto<void>> {
        const dto = this.updateMapper.mapEntityToApi(payload);
        return this.api.update(dto);
    }

    delete(dto: HomeDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.api.delete(homeDeleteMapper(dto));
    }

    enable(dto: HomeEnableDto): Observable<SimpleResponseDto<void>> {
        return this.api.enable(homeEnableMapper(dto));
    }

    disable(dto: HomeDisableDto): Observable<SimpleResponseDto<void>> {
        return this.api.disable(homeDisableMapper(dto));
    }
}
