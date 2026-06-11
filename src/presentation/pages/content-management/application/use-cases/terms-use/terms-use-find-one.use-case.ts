import { inject, Injectable } from '@angular/core';
import { TermsUseFindOneFilterDto } from '@pages/content-management/application/dto/terms-use/terms-use-find-one-filter.dto';
import { TermsUseFindOneFilterEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one-filter.entity';
import { TermsUseFindOneEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { TermsUseFindOneRepository } from '@pages/content-management/domain/repositories/terms-use/terms-use-find-one-repository';
import { TermsUseFindOneFilterVo } from '@pages/content-management/domain/value-objects/terms-use/terms-use-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TermsUseFindOneUseCase {
    private readonly repository = inject(TermsUseFindOneRepository);

    execute(
        filterDto: TermsUseFindOneFilterDto,
        options?: FetchOptions
    ): Observable<TermsUseFindOneEntity> {
        const vo = TermsUseFindOneFilterVo.fromDto(filterDto);
        const filter = TermsUseFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
