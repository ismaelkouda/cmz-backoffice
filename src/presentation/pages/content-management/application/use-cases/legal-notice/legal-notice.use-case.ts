import { inject, Injectable } from '@angular/core';
import { LegalNoticeDeleteDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-delete.dto';
import { LegalNoticeFilterDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-filter.dto';
import { LegalNoticePublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-publish.dto';
import { LegalNoticeUnpublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-unpublish.dto';
import { LegalNoticeCreateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-create.contract';
import { LegalNoticeUpdateContract } from '@pages/content-management/domain/contracts/legal-notice/legal-notice-update.contract';
import { LegalNoticeEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice.entity';
import { LegalNoticeRepository } from '@pages/content-management/domain/repositories/legal-notice/legal-notice-repository';
import { legalNoticeCreateVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-create.vo';
import { legalNoticeDeleteVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-delete.vo';
import { legalNoticeFilterVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-filter.vo';
import { legalNoticePublishVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-publish.vo';
import { legalNoticeUnpublishVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-unpublish.vo';
import { legalNoticeUpdateVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeUseCase {
    private readonly repository = inject(LegalNoticeRepository);

    execute(
        dto: LegalNoticeFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<LegalNoticeEntity>> {
        return this.repository.readAll(legalNoticeFilterVo(dto), page, options);
    }

    create(
        dto: LegalNoticeCreateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(legalNoticeCreateVo(dto)));
    }

    update(
        dto: LegalNoticeUpdateContract
    ): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(legalNoticeUpdateVo(dto)));
    }

    publish(dto: LegalNoticePublishDto): Observable<SimpleResponseDto<void>> {
        return this.repository.publish(legalNoticePublishVo(dto));
    }

    unpublish(
        dto: LegalNoticeUnpublishDto
    ): Observable<SimpleResponseDto<void>> {
        return this.repository.unpublish(legalNoticeUnpublishVo(dto));
    }

    delete(dto: LegalNoticeDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(legalNoticeDeleteVo(dto));
    }
}
