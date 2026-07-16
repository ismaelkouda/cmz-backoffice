import { Injectable } from '@angular/core';
import { HomeDeleteDto } from '@pages/content-management/application/dto/home/home-delete.dto';
import { HomeDisableDto } from '@pages/content-management/application/dto/home/home-disable.dto';
import { HomeEnableDto } from '@pages/content-management/application/dto/home/home-enable.dto';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { HomeCreateProps } from '@pages/content-management/domain/interfaces/home/home-create-props.interface';
import { HomeUpdateProps } from '@pages/content-management/domain/interfaces/home/home-update-props.interface';
import { HomeFilterVo } from '@pages/content-management/domain/value-objects/home/home-filter.vo';
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
        filter: HomeFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<HomeEntity>>;
    abstract create(
        props: HomeCreateProps
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        props: HomeUpdateProps
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(dto: HomeDeleteDto): Observable<SimpleResponseDto<void>>;
    abstract enable(dto: HomeEnableDto): Observable<SimpleResponseDto<void>>;
    abstract disable(dto: HomeDisableDto): Observable<SimpleResponseDto<void>>;
}
