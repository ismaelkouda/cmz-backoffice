import { inject, Injectable } from '@angular/core';
import { HomeDeleteDto } from '@pages/content-management/application/dto/home/home-delete.dto';
import { HomeDisableDto } from '@pages/content-management/application/dto/home/home-disable.dto';
import { HomeEnableDto } from '@pages/content-management/application/dto/home/home-enable.dto';
import { HomeFilterDto } from '@pages/content-management/application/dto/home/home-filter.dto';
import { HomeCreateContract } from '@pages/content-management/domain/contracts/home/home-create.contract';
import { HomeUpdateContract } from '@pages/content-management/domain/contracts/home/home-update.contract';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { HomeRepository } from '@pages/content-management/domain/repositories/home/home-repository';
import { homeCreateVo } from '@pages/content-management/domain/value-objects/home/home-create.vo';
import { homeDeleteVo } from '@pages/content-management/domain/value-objects/home/home-delete.vo';
import { homeDisableVo } from '@pages/content-management/domain/value-objects/home/home-disable.vo';
import { homeEnableVo } from '@pages/content-management/domain/value-objects/home/home-enable.vo';
import { homeFilterVo } from '@pages/content-management/domain/value-objects/home/home-filter.vo';
import { homeUpdateVo } from '@pages/content-management/domain/value-objects/home/home-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class HomeUseCase {
    private readonly repository = inject(HomeRepository);

    execute(
        dto: HomeFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<HomeEntity>> {
        return defer(() =>
            this.repository.readAll(homeFilterVo(dto), page, options)
        );
    }

    create(dto: HomeCreateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(homeCreateVo(dto)));
    }

    update(dto: HomeUpdateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(homeUpdateVo(dto)));
    }

    enable(dto: HomeEnableDto): Observable<SimpleResponseDto<void>> {
        return this.repository.enable(homeEnableVo(dto));
    }

    disable(dto: HomeDisableDto): Observable<SimpleResponseDto<void>> {
        return this.repository.disable(homeDisableVo(dto));
    }

    delete(dto: HomeDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(homeDeleteVo(dto));
    }
}
