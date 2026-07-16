import { termsUseQueryMapper } from '@pages/content-management/application/queries-mappers/terms-use/terms-use.mapper';
import { Injectable, inject } from '@angular/core';
import { TermsUseQuery } from '@pages/content-management/application/queries/terms-use/terms-use.query';
import { TermsUseUseCase } from '@pages/content-management/application/use-cases/terms-use/terms-use.use-case';
import { TermsUseEntity } from '@pages/content-management/domain/entities/terms-use/terms-use.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TermsUseHandler {
    private readonly useCase = inject(TermsUseUseCase);

    execute(
        command: TermsUseQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<TermsUseEntity>> {
        return this.useCase.execute(
            termsUseQueryMapper(command),
            page,
            options
        );
    }
}
