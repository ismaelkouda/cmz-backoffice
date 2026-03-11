import { Injectable } from '@angular/core';
import { PrivacyPolicyFindOneQuery } from '@pages/content-management/application/queries/privacy-policy/privacy-policy-find-one.query';
import { PrivacyPolicyFindOneUseCase } from '@pages/content-management/application/use-cases/privacy-policy/privacy-policy-find-one.use-case';
import { PrivacyPolicyFindOneEntity } from '@pages/content-management/domain/entities/privacy-policy/privacy-policy-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyFindOneHandler {
    constructor(private readonly useCase: PrivacyPolicyFindOneUseCase) {}

    execute(
        command: PrivacyPolicyFindOneQuery
    ): Observable<PrivacyPolicyFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
