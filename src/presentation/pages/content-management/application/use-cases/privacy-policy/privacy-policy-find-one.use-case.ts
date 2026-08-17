import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyFindOneFilterDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-find-one-filter.dto';
import { PrivacyPolicyFindOneFilterEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one-filter.entity';
import { PrivacyPolicyFindOneEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { PrivacyPolicyFindOneRepository } from '@pages/content-management/domain/repositories/privacy-policy/privacy-policy-find-one-repository';
import { PrivacyPolicyFindOneFilterVo } from '@pages/content-management/domain/value-objects/privacy-policy/privacy-policy-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyFindOneUseCase {
    private readonly repository = inject(PrivacyPolicyFindOneRepository);

    execute(
        filterDto: PrivacyPolicyFindOneFilterDto,
        options?: FetchOptions
    ): Observable<PrivacyPolicyFindOneEntity> {
        const vo = PrivacyPolicyFindOneFilterVo.fromDto(filterDto);
        const filter = PrivacyPolicyFindOneFilterEntity.fromVo(vo);
        return this.repository.execute(filter, options);
    }
}
