import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { SlideCreateDto } from '@presentation/pages/content-management/application/dto/slide/slide-create.dto';
import { SlideDeleteDto } from '@presentation/pages/content-management/application/dto/slide/slide-delete.dto';
import { SlideFilterDto } from '@presentation/pages/content-management/application/dto/slide/slide-filter.dto';
import { SlidePublishDto } from '@presentation/pages/content-management/application/dto/slide/slide-publish.dto';
import { SlideUnpublishDto } from '@presentation/pages/content-management/application/dto/slide/slide-unpublish.dto';
import { SlideUpdateDto } from '@presentation/pages/content-management/application/dto/slide/slide-update.dto';
import { SlideCreateEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-create.entity';
import { SlideDeleteEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-delete.entity';
import { SlideFilterEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-filter.entity';
import { SlidePublishEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-publish.entity';
import { SlideUnpublishEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-unpublish.entity';
import { SlideUpdateEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-update.entity';
import { SlideEntity } from '@presentation/pages/content-management/domain/entities/slide/slide.entity';
import { SlideRepository } from '@presentation/pages/content-management/domain/repositories/slide/slide-repository';
import { SlideCreateVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-create.vo';
import { SlideDeleteVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-delete.vo';
import { SlideFilterVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-filter.vo';
import { SlidePublishVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-publish.vo';
import { SlideUnpublishVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-unpublish.vo';
import { SlideUpdateVo } from '@presentation/pages/content-management/domain/value-objects/slide/slide-update.vo';

@Injectable({
    providedIn: 'root',
})
export class SlideUseCase {
    private readonly repository = inject(SlideRepository);

    execute(
        dto: SlideFilterDto | null,
        page: string
    ): Observable<Paginate<SlideEntity>> {
        const vo = SlideFilterVo.fromDto(dto);
        const entity = SlideFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(dto: SlideCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = SlideCreateVo.fromDto(dto);
        const entity = SlideCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: SlideUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = SlideUpdateVo.fromDto(dto);
        const entity = SlideUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    publish(dto: SlidePublishDto): Observable<SimpleResponseDto<void>> {
        const vo = SlidePublishVo.fromDto(dto);
        const entity = SlidePublishEntity.fromVo(vo);
        return this.repository.publish(entity);
    }

    unpublish(dto: SlideUnpublishDto): Observable<SimpleResponseDto<void>> {
        const vo = SlideUnpublishVo.fromDto(dto);
        const entity = SlideUnpublishEntity.fromVo(vo);
        return this.repository.unpublish(entity);
    }

    delete(dto: SlideDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = SlideDeleteVo.fromDto(dto);
        const entity = SlideDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
