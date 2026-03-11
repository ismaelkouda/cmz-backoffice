import { inject, Injectable } from '@angular/core';
import { PrivacyPolicyFindOneFilterEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one-filter.entity';
import { PrivacyPolicyFindOneEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { PrivacyPolicyFindOneRepository } from '@pages/content-management/domain/repositories/privacy-policy/privacy-policy-find-one-repository';
import { privacyPolicyFindOneFilterMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-find-one-filter.mapper';
import { PrivacyPolicyFindOneMapper } from '@pages/content-management/infrastructure/data/mappers/privacy-policy/privacy-policy-find-one.mapper';
import { PrivacyPolicyFindOneApi } from '@pages/content-management/infrastructure/data/sources/privacy-policy/privacy-policy-find-one.api';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyFindOneRepositoryImpl implements PrivacyPolicyFindOneRepository {
    private readonly api = inject(PrivacyPolicyFindOneApi);
    private readonly mapper = inject(PrivacyPolicyFindOneMapper);

    execute(
        filter: PrivacyPolicyFindOneFilterEntity
    ): Observable<PrivacyPolicyFindOneEntity> {
        const paramsDto = privacyPolicyFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
