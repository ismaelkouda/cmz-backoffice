import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { TermsUseQuery } from '@presentation/pages/content-management/application/queries/terms-use/terms-use.query';
import { TermsUseUseCase } from '@presentation/pages/content-management/application/use-cases/terms-use/terms-use.use-case';
import { TermsUseEntity } from '@presentation/pages/content-management/domain/entities/terms-use/terms-use.entity';

@Injectable({ providedIn: 'root' })
export class TermsUseHandler {
    constructor(private readonly useCase: TermsUseUseCase) {}

    execute(
        command: TermsUseQuery,
        page: string
    ): Observable<Paginate<TermsUseEntity>> {
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
