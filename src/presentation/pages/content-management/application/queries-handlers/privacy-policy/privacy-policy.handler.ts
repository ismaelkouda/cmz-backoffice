import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { PrivacyPolicyQuery } from '@presentation/pages/content-management/application/queries/privacy-policy/privacy-policy.query';
import { PrivacyPolicyUseCase } from '@presentation/pages/content-management/application/use-cases/privacy-policy/privacy-policy.use-case';
import { PrivacyPolicyEntity } from '@presentation/pages/content-management/domain/entities/privacy-policy/privacy-policy.entity';

@Injectable({ providedIn: 'root' })
export class PrivacyPolicyHandler {
    constructor(private readonly useCase: PrivacyPolicyUseCase) {}

    execute(
        command: PrivacyPolicyQuery,
        page: string
    ): Observable<Paginate<PrivacyPolicyEntity>> {
        return this.useCase.execute(
            {
                search: command.search,
                version: command.version,
                status: command.status,
                startDate: command.startDate,
                endDate: command.endDate,
            },
            page
        );
    }
}
