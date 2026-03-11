import { Injectable } from '@angular/core';
import { LegalNoticeFindOneQuery } from '@pages/content-management/application/queries/legal-notice/legal-notice-find-one.query';
import { LegalNoticeFindOneUseCase } from '@pages/content-management/application/use-cases/legal-notice/legal-notice-find-one.use-case';
import { LegalNoticeFindOneEntity } from '@pages/content-management/domain/entities/legal-notice/legal-notice-find-one.entity';
import { Observable } from 'rxjs';

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
