import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { HomeCreateDto } from '@presentation/pages/content-management/application/dto/home/home-create.dto';
import { HomeDeleteDto } from '@presentation/pages/content-management/application/dto/home/home-delete.dto';
import { HomeDisableDto } from '@presentation/pages/content-management/application/dto/home/home-disable.dto';
import { HomeEnableDto } from '@presentation/pages/content-management/application/dto/home/home-enable.dto';
import { HomeFilterDto } from '@presentation/pages/content-management/application/dto/home/home-filter.dto';
import { HomeUpdateDto } from '@presentation/pages/content-management/application/dto/home/home-update.dto';
import { HomeCreateEntity } from '@presentation/pages/content-management/domain/entities/home/home-create.entity';
import { HomeDeleteEntity } from '@presentation/pages/content-management/domain/entities/home/home-delete.entity';
import { HomeDisableEntity } from '@presentation/pages/content-management/domain/entities/home/home-disable.entity';
import { HomeEnableEntity } from '@presentation/pages/content-management/domain/entities/home/home-enable.entity';
import { HomeFilterEntity } from '@presentation/pages/content-management/domain/entities/home/home-filter.entity';
import { HomeUpdateEntity } from '@presentation/pages/content-management/domain/entities/home/home-update.entity';
import { HomeEntity } from '@presentation/pages/content-management/domain/entities/home/home.entity';
import { HomeRepository } from '@presentation/pages/content-management/domain/repositories/home/home-repository';
import { HomeCreateVo } from '@presentation/pages/content-management/domain/value-objects/home/home-create.vo';
import { HomeDeleteVo } from '@presentation/pages/content-management/domain/value-objects/home/home-delete.vo';
import { HomeDisableVo } from '@presentation/pages/content-management/domain/value-objects/home/home-disable.vo';
import { HomeEnableVo } from '@presentation/pages/content-management/domain/value-objects/home/home-enable.vo';
import { HomeFilterVo } from '@presentation/pages/content-management/domain/value-objects/home/home-filter.vo';
import { HomeUpdateVo } from '@presentation/pages/content-management/domain/value-objects/home/home-update.vo';

@Injectable({
    providedIn: 'root',
})
export class HomeUseCase {
    private readonly repository = inject(HomeRepository);

    execute(
        dto: HomeFilterDto | null,
        page: string
    ): Observable<Paginate<HomeEntity>> {
        const vo = HomeFilterVo.fromDto(dto);
        const entity = HomeFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(dto: HomeCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = HomeCreateVo.fromDto(dto);
        const entity = HomeCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: HomeUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = HomeUpdateVo.fromDto(dto);
        const entity = HomeUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    enable(dto: HomeEnableDto): Observable<SimpleResponseDto<void>> {
        const vo = HomeEnableVo.fromDto(dto);
        const entity = HomeEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(dto: HomeDisableDto): Observable<SimpleResponseDto<void>> {
        const vo = HomeDisableVo.fromDto(dto);
        const entity = HomeDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }

    delete(dto: HomeDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = HomeDeleteVo.fromDto(dto);
        const entity = HomeDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
