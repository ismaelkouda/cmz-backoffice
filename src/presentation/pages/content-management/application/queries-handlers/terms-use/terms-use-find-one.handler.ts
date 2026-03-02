import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TermsUseFindOneQuery } from '@presentation/pages/content-management/application/queries/terms-use/terms-use-find-one.query';
import { TermsUseFindOneUseCase } from '@presentation/pages/content-management/application/use-cases/terms-use/terms-use-find-one.use-case';
import { TermsUseFindOneEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneHandler {
    constructor(private readonly useCase: TermsUseFindOneUseCase) {}

    execute(command: TermsUseFindOneQuery): Observable<TermsUseFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
