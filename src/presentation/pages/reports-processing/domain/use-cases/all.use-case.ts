import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { AllEntity } from '../entities/all/all.entity';
import { AllRepository } from '../repositories/all.repository';
import { AllFilter } from '../value-objects/all-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchAllUseCase {
    private readonly allRepository = inject(AllRepository);

    execute(filter: AllFilter, page: string): Observable<Paginate<AllEntity>> {
        return this.allRepository.fetchAll(filter, page);
    }
}
