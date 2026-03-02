import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LegalNoticeFindOneQuery } from '@presentation/pages/content-management/application/queries/legal-notice/legal-notice-find-one.query';
import { LegalNoticeFindOneUseCase } from '@presentation/pages/content-management/application/use-cases/legal-notice/legal-notice-find-one.use-case';
import { LegalNoticeFindOneEntity } from '@presentation/pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';

@Injectable({ providedIn: 'root' })
export class LegalNoticeFindOneHandler {
    constructor(private readonly useCase: LegalNoticeFindOneUseCase) {}

    execute(
        command: LegalNoticeFindOneQuery
    ): Observable<LegalNoticeFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
