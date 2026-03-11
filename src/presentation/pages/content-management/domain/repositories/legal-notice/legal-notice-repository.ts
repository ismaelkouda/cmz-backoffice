import { Injectable } from '@angular/core';
import { LegalNoticeCreateEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-create.entity';
import { LegalNoticeDeleteEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-delete.entity';
import { LegalNoticeFilterEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-filter.entity';
import { LegalNoticePublishEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-publish.entity';
import { LegalNoticeUnpublishEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-unpublish.entity';
import { LegalNoticeUpdateEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-update.entity';
import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class LegalNoticeRepository {
    abstract readAll(
        entity: LegalNoticeFilterEntity | null,
        page: string
    ): Observable<Paginate<LegalNoticeEntity>>;
    abstract create(
        entity: LegalNoticeCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: LegalNoticeUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: LegalNoticeDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract publish(
        entity: LegalNoticePublishEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract unpublish(
        entity: LegalNoticeUnpublishEntity
    ): Observable<SimpleResponseDto<void>>;
}
