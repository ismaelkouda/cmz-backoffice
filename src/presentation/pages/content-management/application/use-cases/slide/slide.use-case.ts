import { inject, Injectable } from '@angular/core';
import { SlideCreateDto } from '@pages/content-management/application/dto/slide/slide-create.dto';
import { SlideDeleteDto } from '@pages/content-management/application/dto/slide/slide-delete.dto';
import { SlideDisableDto } from '@pages/content-management/application/dto/slide/slide-disable.dto';
import { SlideEnableDto } from '@pages/content-management/application/dto/slide/slide-enable.dto';
import { SlideFilterDto } from '@pages/content-management/application/dto/slide/slide-filter.dto';
import { SlideUpdateDto } from '@pages/content-management/application/dto/slide/slide-update.dto';
import { SlideCreateEntity } from '@pages/content-management/domain/entities/slide/slide-create.entity';
import { SlideDeleteEntity } from '@pages/content-management/domain/entities/slide/slide-delete.entity';
import { SlideDisableEntity } from '@pages/content-management/domain/entities/slide/slide-disable.entity';
import { SlideEnableEntity } from '@pages/content-management/domain/entities/slide/slide-enable.entity';
import { SlideFilterEntity } from '@pages/content-management/domain/entities/slide/slide-filter.entity';
import { SlideUpdateEntity } from '@pages/content-management/domain/entities/slide/slide-update.entity';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { SlideRepository } from '@pages/content-management/domain/repositories/slide/slide-repository';
import { SlideCreateVo } from '@pages/content-management/domain/value-objects/slide/slide-create.vo';
import { SlideDeleteVo } from '@pages/content-management/domain/value-objects/slide/slide-delete.vo';
import { SlideDisableVo } from '@pages/content-management/domain/value-objects/slide/slide-disable.vo';
import { SlideEnableVo } from '@pages/content-management/domain/value-objects/slide/slide-enable.vo';
import { SlideFilterVo } from '@pages/content-management/domain/value-objects/slide/slide-filter.vo';
import { SlideUpdateVo } from '@pages/content-management/domain/value-objects/slide/slide-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SlideUseCase {
    private readonly repository = inject(SlideRepository);

    execute(
        dto: SlideFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SlideEntity>> {
        const vo = SlideFilterVo.fromDto(dto);
        const entity = SlideFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page, options);
    }

    create(dto: SlideCreateDto): Observable<SimpleResponseDto<void>> {
        return defer(() => {
            const vo = SlideCreateVo.fromDto(dto);
            const entity = SlideCreateEntity.fromVo(vo);
            return this.repository.create(entity);
        });
    }

    update(dto: SlideUpdateDto): Observable<SimpleResponseDto<void>> {
        return defer(() => {
            const vo = SlideUpdateVo.fromDto(dto);
            const entity = SlideUpdateEntity.fromVo(vo);
            return this.repository.update(entity);
        });
    }

    enable(dto: SlideEnableDto): Observable<SimpleResponseDto<void>> {
        return defer(() => {
            const vo = SlideEnableVo.fromDto(dto);
            const entity = SlideEnableEntity.fromVo(vo);
            return this.repository.enable(entity);
        });
    }

    disable(dto: SlideDisableDto): Observable<SimpleResponseDto<void>> {
        return defer(() => {
            const vo = SlideDisableVo.fromDto(dto);
            const entity = SlideDisableEntity.fromVo(vo);
            return this.repository.disable(entity);
        });
    }

    delete(dto: SlideDeleteDto): Observable<SimpleResponseDto<void>> {
        return defer(() => {
            const vo = SlideDeleteVo.fromDto(dto);
            const entity = SlideDeleteEntity.fromVo(vo);
            return this.repository.delete(entity);
        });
    }
}
