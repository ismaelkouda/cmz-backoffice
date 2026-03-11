import { inject, Injectable } from '@angular/core';
import { HomeCreateDto } from '@pages/content-management/application/dto/home/home-create.dto';
import { HomeDeleteDto } from '@pages/content-management/application/dto/home/home-delete.dto';
import { HomeDisableDto } from '@pages/content-management/application/dto/home/home-disable.dto';
import { HomeEnableDto } from '@pages/content-management/application/dto/home/home-enable.dto';
import { HomeFilterDto } from '@pages/content-management/application/dto/home/home-filter.dto';
import { HomeUpdateDto } from '@pages/content-management/application/dto/home/home-update.dto';
import { HomeCreateEntity } from '@pages/content-management/domain/entities/home/home-create.entity';
import { HomeDeleteEntity } from '@pages/content-management/domain/entities/home/home-delete.entity';
import { HomeDisableEntity } from '@pages/content-management/domain/entities/home/home-disable.entity';
import { HomeEnableEntity } from '@pages/content-management/domain/entities/home/home-enable.entity';
import { HomeFilterEntity } from '@pages/content-management/domain/entities/home/home-filter.entity';
import { HomeUpdateEntity } from '@pages/content-management/domain/entities/home/home-update.entity';
import { HomeEntity } from '@pages/content-management/domain/entities/home/home.entity';
import { HomeRepository } from '@pages/content-management/domain/repositories/home/home-repository';
import { HomeCreateVo } from '@pages/content-management/domain/value-objects/home/home-create.vo';
import { HomeDeleteVo } from '@pages/content-management/domain/value-objects/home/home-delete.vo';
import { HomeDisableVo } from '@pages/content-management/domain/value-objects/home/home-disable.vo';
import { HomeEnableVo } from '@pages/content-management/domain/value-objects/home/home-enable.vo';
import { HomeFilterVo } from '@pages/content-management/domain/value-objects/home/home-filter.vo';
import { HomeUpdateVo } from '@pages/content-management/domain/value-objects/home/home-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
