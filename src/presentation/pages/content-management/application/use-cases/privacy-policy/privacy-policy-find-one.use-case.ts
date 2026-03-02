import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PrivacyPolicyFindOneFilterDto } from '@presentation/pages/content-management/application/dto/privacy-policy/privacy-policy-find-one-filter.dto';
import { PrivacyPolicyFindOneFilterEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one-filter.entity';
import { PrivacyPolicyFindOneEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { PrivacyPolicyFindOneRepository } from '@presentation/pages/content-management/domain/repositories/privacy-policy/privacy-policy-find-one-repository';
import { PrivacyPolicyFindOneFilterVo } from '@presentation/pages/content-management/domain/value-objects/privacy-policy/privacy-policy-find-one-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyFindOneUseCase {
    private readonly repository = inject(PrivacyPolicyFindOneRepository);

    execute(
        filterDto: PrivacyPolicyFindOneFilterDto
    ): Observable<PrivacyPolicyFindOneEntity> {
        const vo = PrivacyPolicyFindOneFilterVo.fromDto(filterDto);
        const filter = PrivacyPolicyFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter);
    }
}
