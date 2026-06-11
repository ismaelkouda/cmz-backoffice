import { inject, Injectable } from '@angular/core';
import { LegalNoticeCreateEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-create.entity';
import { LegalNoticeDeleteEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-delete.entity';
import { LegalNoticeFilterEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-filter.entity';
import { LegalNoticePublishEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-publish.entity';
import { LegalNoticeUnpublishEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-unpublish.entity';
import { LegalNoticeUpdateEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-update.entity';
import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { LegalNoticeRepository } from '@pages/content-management/domain/repositories/legal-notice/legal-notice-repository';
import { legalNoticeCreateMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-create.mapper';
import { legalNoticeDeleteMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-delete.mapper';
import { legalNoticeFilterMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-filter.mapper';
import { legalNoticePublishMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-publish.mapper';
import { legalNoticeUnpublishMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-unpublish.mapper';
import { legalNoticeUpdateMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice-update.mapper';
import { LegalNoticeMapper } from '@pages/content-management/infrastructure/data/mappers/legal-notice/legal-notice.mapper';
import { LegalNoticeApi } from '@pages/content-management/infrastructure/data/sources/legal-notice/legal-notice.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeRepositoryImpl implements LegalNoticeRepository {
    private readonly api = inject(LegalNoticeApi);
    private readonly mapper = inject(LegalNoticeMapper);

    readAll(
        filter: LegalNoticeFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<LegalNoticeEntity>> {
        return this.api
            .readAll(legalNoticeFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: LegalNoticeCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(legalNoticeCreateMapper(payload));
    }

    update(
        payload: LegalNoticeUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(legalNoticeUpdateMapper(payload));
    }

    delete(
        entity: LegalNoticeDeleteEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.delete(legalNoticeDeleteMapper(entity));
    }

    publish(
        entity: LegalNoticePublishEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.publish(legalNoticePublishMapper(entity));
    }

    unpublish(
        entity: LegalNoticeUnpublishEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.unpublish(legalNoticeUnpublishMapper(entity));
    }
}
