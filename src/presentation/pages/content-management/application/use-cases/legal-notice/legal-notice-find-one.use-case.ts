import { inject, Injectable } from '@angular/core';
import { LegalNoticeFindOneFilterDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-find-one-filter.dto';
import { LegalNoticeFindOneFilterEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one-filter.entity';
import { LegalNoticeFindOneEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { LegalNoticeFindOneRepository } from '@pages/content-management/domain/repositories/legal-notice/legal-notice-find-one-repository';
import { LegalNoticeFindOneFilterVo } from '@pages/content-management/domain/value-objects/legal-notice/legal-notice-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeFindOneUseCase {
    private readonly repository = inject(LegalNoticeFindOneRepository);

    execute(
        filterDto: LegalNoticeFindOneFilterDto,
        options?: FetchOptions
    ): Observable<LegalNoticeFindOneEntity> {
        const vo = LegalNoticeFindOneFilterVo.fromDto(filterDto);
        const filter = LegalNoticeFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
