import { Injectable } from '@angular/core';
import { TermsUseQuery } from '@pages/content-management/application/queries/terms-use/terms-use.query';
import { TermsUseUseCase } from '@pages/content-management/application/use-cases/terms-use/terms-use.use-case';
import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
