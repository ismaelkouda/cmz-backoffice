import { privacyPolicyFindOneQueryMapper } from '@pages/content-management/application/queries-mappers/privacy-policy/privacy-policy-find-one.mapper';
import { Injectable, inject } from '@angular/core';
import { PrivacyPolicyFindOneQuery } from '@pages/content-management/application/queries/privacy-policy/privacy-policy-find-one.query';
import { PrivacyPolicyFindOneUseCase } from '@pages/content-management/application/use-cases/privacy-policy/privacy-policy-find-one.use-case';
import { PrivacyPolicyFindOneEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyFindOneHandler {
    private readonly useCase = inject(PrivacyPolicyFindOneUseCase);

    execute(
        command: PrivacyPolicyFindOneQuery,
        options?: FetchOptions
    ): Observable<PrivacyPolicyFindOneEntity> {
        return this.useCase.execute(
            privacyPolicyFindOneQueryMapper(command),
            options
        );
    }
}
