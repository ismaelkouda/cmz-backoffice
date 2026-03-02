import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { LegalNoticeCreateDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-create.dto';
import { LegalNoticeDeleteDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-delete.dto';
import { LegalNoticeFilterDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-filter.dto';
import { LegalNoticePublishDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-publish.dto';
import { LegalNoticeUnpublishDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-unpublish.dto';
import { LegalNoticeUpdateDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-update.dto';
import { LegalNoticeCreateEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-create.entity';
import { LegalNoticeDeleteEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-delete.entity';
import { LegalNoticeFilterEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-filter.entity';
import { LegalNoticePublishEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-publish.entity';
import { LegalNoticeUnpublishEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-unpublish.entity';
import { LegalNoticeUpdateEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-update.entity';
import { LegalNoticeEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { LegalNoticeRepository } from '@presentation/pages/content-management/domain/repositories/legal-notice/legal-notice-repository';
import { LegalNoticeCreateVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-create.vo';
import { LegalNoticeDeleteVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-delete.vo';
import { LegalNoticeFilterVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-filter.vo';
import { LegalNoticePublishVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-publish.vo';
import { LegalNoticeUnpublishVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-unpublish.vo';
import { LegalNoticeUpdateVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-update.vo';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeUseCase {
    private readonly repository = inject(LegalNoticeRepository);

    execute(
        dto: LegalNoticeFilterDto | null,
        page: string
    ): Observable<Paginate<LegalNoticeEntity>> {
        const vo = LegalNoticeFilterVo.fromDto(dto);
        const entity = LegalNoticeFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(dto: LegalNoticeCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = LegalNoticeCreateVo.fromDto(dto);
        const entity = LegalNoticeCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: LegalNoticeUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = LegalNoticeUpdateVo.fromDto(dto);
        const entity = LegalNoticeUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    publish(dto: LegalNoticePublishDto): Observable<SimpleResponseDto<void>> {
        const vo = LegalNoticePublishVo.fromDto(dto);
        const entity = LegalNoticePublishEntity.fromVo(vo);
        return this.repository.publish(entity);
    }

    unpublish(
        dto: LegalNoticeUnpublishDto
    ): Observable<SimpleResponseDto<void>> {
        const vo = LegalNoticeUnpublishVo.fromDto(dto);
        const entity = LegalNoticeUnpublishEntity.fromVo(vo);
        return this.repository.unpublish(entity);
    }

    delete(dto: LegalNoticeDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = LegalNoticeDeleteVo.fromDto(dto);
        const entity = LegalNoticeDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
