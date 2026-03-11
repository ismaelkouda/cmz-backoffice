import { Injectable } from '@angular/core';
import { TermsUseFindOneQuery } from '@pages/content-management/application/queries/terms-use/terms-use-find-one.query';
import { TermsUseFindOneUseCase } from '@pages/content-management/application/use-cases/terms-use/terms-use-find-one.use-case';
import { TermsUseFindOneEntity } from '@pages/content-management/domain/entities/terms-use/terms-use-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseFindOneHandler {
    constructor(private readonly useCase: TermsUseFindOneUseCase) {}

    execute(command: TermsUseFindOneQuery): Observable<TermsUseFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
