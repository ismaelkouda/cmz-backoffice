import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TermsUseFindOneFilterDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-find-one-filter.dto';
import { TermsUseFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-find-one-filter.entity';
import { TermsUseFindOneEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { TermsUseFindOneRepository } from '@presentation/pages/content-management/domain/repositories/terms-use/terms-use-find-one-repository';
import { TermsUseFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/terms-use/terms-use-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class TermsUseFindOneUseCase {
    private readonly repository = inject(TermsUseFindOneRepository);

    execute(
        filterDto: TermsUseFindOneFilterDto
    ): Observable<TermsUseFindOneEntity> {
        const vo = TermsUseFindOneFilterVo.fromDto(filterDto);
        const filter = TermsUseFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
