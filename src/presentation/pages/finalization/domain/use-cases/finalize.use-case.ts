import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { FinalizeEntity } from '../entities/finalize/finalize.entity';
import { FinalizeRepository } from '../repositories/finalize.repository';
import { FinalizeFilter } from '../value-objects/finalize-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchFinalizesUseCase {
    private readonly finalizeRepository = inject(FinalizeRepository);

    execute(
        filter: FinalizeFilter,
        page: string
    ): Observable<Paginate<FinalizeEntity>> {
        return this.finalizeRepository.fetchFinalizes(filter, page);
    }
}
