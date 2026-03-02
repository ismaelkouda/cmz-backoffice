import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { TermsUseCreateDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-create.dto';
import { TermsUseDeleteDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-delete.dto';
import { TermsUseFilterDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-filter.dto';
import { TermsUsePublishDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-publish.dto';
import { TermsUseUnpublishDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-unpublish.dto';
import { TermsUseUpdateDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-update.dto';
import { TermsUseCreateEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-create.entity';
import { TermsUseDeleteEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-delete.entity';
import { TermsUseFilterEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-filter.entity';
import { TermsUsePublishEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-publish.entity';
import { TermsUseUnpublishEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-unpublish.entity';
import { TermsUseUpdateEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-update.entity';
import { TermsUseEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use.entity';
import { TermsUseRepository } from '@presentation/pages/content-management/domain/repositories/terms-use/terms-use-repository';
import { TermsUseCreateVo } from '@presentation/pages/content-management/domain/value-objects/terms-use/terms-use-create.vo';
import { TermsUseDeleteVo } from '@presentation/pages/content-management/domain/value-objects/terms-use/terms-use-delete.vo';
import { TermsUseFilterVo } from '@presentation/pages/content-management/domain/value-objects/terms-use/terms-use-filter.vo';
import { TermsUsePublishVo } from '@presentation/pages/content-management/domain/value-objects/terms-use/terms-use-publish.vo';
import { TermsUseUnpublishVo } from '@presentation/pages/content-management/domain/value-objects/terms-use/terms-use-unpublish.vo';
import { TermsUseUpdateVo } from '@presentation/pages/content-management/domain/value-objects/terms-use/terms-use-update.vo';

@Injectable({
    providedIn: 'root',
})
export class TermsUseUseCase {
    private readonly repository = inject(TermsUseRepository);

    execute(
        dto: TermsUseFilterDto | null,
        page: string
    ): Observable<Paginate<TermsUseEntity>> {
        const vo = TermsUseFilterVo.fromDto(dto);
        const entity = TermsUseFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(dto: TermsUseCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = TermsUseCreateVo.fromDto(dto);
        const entity = TermsUseCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: TermsUseUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = TermsUseUpdateVo.fromDto(dto);
        const entity = TermsUseUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    publish(dto: TermsUsePublishDto): Observable<SimpleResponseDto<void>> {
        const vo = TermsUsePublishVo.fromDto(dto);
        const entity = TermsUsePublishEntity.fromVo(vo);
        return this.repository.publish(entity);
    }

    unpublish(dto: TermsUseUnpublishDto): Observable<SimpleResponseDto<void>> {
        const vo = TermsUseUnpublishVo.fromDto(dto);
        const entity = TermsUseUnpublishEntity.fromVo(vo);
        return this.repository.unpublish(entity);
    }

    delete(dto: TermsUseDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = TermsUseDeleteVo.fromDto(dto);
        const entity = TermsUseDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
