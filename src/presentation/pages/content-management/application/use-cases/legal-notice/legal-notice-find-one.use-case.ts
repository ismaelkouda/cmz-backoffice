import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LegalNoticeFindOneFilterDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-find-one-filter.dto';
import { LegalNoticeFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one-filter.entity';
import { LegalNoticeFindOneEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { LegalNoticeFindOneRepository } from '@presentation/pages/content-management/domain/repositories/legal-notice/legal-notice-find-one-repository';
import { LegalNoticeFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeFindOneUseCase {
    private readonly repository = inject(LegalNoticeFindOneRepository);

    execute(
        filterDto: LegalNoticeFindOneFilterDto
    ): Observable<LegalNoticeFindOneEntity> {
        const vo = LegalNoticeFindOneFilterVo.fromDto(filterDto);
        const filter = LegalNoticeFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
