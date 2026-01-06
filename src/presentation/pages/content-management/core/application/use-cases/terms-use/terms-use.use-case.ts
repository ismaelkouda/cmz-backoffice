import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { TermsUseEntity } from '../../../domain/entities/terms-use.entity';
import { TermsUseRepository } from '../../../domain/repositories/terms-use.repository';
import { TermsUseFilter } from '../../../domain/value-objects/terms-use-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchTermsUseUseCase {
    private readonly termsUseRepository = inject(TermsUseRepository);

    execute(
        filter: TermsUseFilter,
        page: string
    ): Observable<Paginate<TermsUseEntity>> {
        return this.termsUseRepository.fetchTermsUse(filter, page);
    }
}
