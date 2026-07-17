import { Injectable } from '@angular/core';
import { LegalNoticeDeleteDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-delete.dto';
import { LegalNoticePublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-publish.dto';
import { LegalNoticeUnpublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-unpublish.dto';
import { LegalNoticeCreateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-create.validate-contract';
import { LegalNoticeUpdateValidateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-update.validate-contract';
import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { LegalNoticeFilterVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-filter.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class LegalNoticeRepository {
    abstract readAll(
        filter: LegalNoticeFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<LegalNoticeEntity>>;
    abstract create(
        contract: LegalNoticeCreateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        contract: LegalNoticeUpdateValidateContract
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        dto: LegalNoticeDeleteDto
    ): Observable<SimpleResponseDto<void>>;
    abstract publish(
        dto: LegalNoticePublishDto
    ): Observable<SimpleResponseDto<void>>;
    abstract unpublish(
        dto: LegalNoticeUnpublishDto
    ): Observable<SimpleResponseDto<void>>;
}
