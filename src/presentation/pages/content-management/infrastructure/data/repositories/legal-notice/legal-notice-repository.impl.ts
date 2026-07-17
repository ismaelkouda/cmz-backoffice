import { inject, Injectable } from '@angular/core';
import { LegalNoticeDeleteDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-delete.dto';
import { LegalNoticePublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-publish.dto';
import { LegalNoticeUnpublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-unpublish.dto';
import { LegalNoticeCreateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-create.validate-contract';
import { LegalNoticeUpdateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-update.validate-contract';
import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { LegalNoticeRepository } from '@pages/content-management/domain/repositories/legal-notice/legal-notice-repository';
import { LegalNoticeFilterVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-filter.vo';
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
        filter: LegalNoticeFilterVo,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<LegalNoticeEntity>> {
        return this.api
            .readAll(legalNoticeFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: LegalNoticeCreateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(legalNoticeCreateMapper(payload));
    }

    update(
        payload: LegalNoticeUpdateValidateContract
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(legalNoticeUpdateMapper(payload));
    }

    delete(dto: LegalNoticeDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.api.delete(legalNoticeDeleteMapper(dto));
    }

    publish(dto: LegalNoticePublishDto): Observable<SimpleResponseDto<void>> {
        return this.api.publish(legalNoticePublishMapper(dto));
    }

    unpublish(
        dto: LegalNoticeUnpublishDto
    ): Observable<SimpleResponseDto<void>> {
        return this.api.unpublish(legalNoticeUnpublishMapper(dto));
    }
}
