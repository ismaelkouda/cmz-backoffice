import { inject, Injectable } from '@angular/core';
import { Paginate } from '@shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { NewspapersEntity } from '../entities/management/newspapers/newspapers.entity';
import { NewspapersRepository } from '../repositories/newspapers.repository';
import { NewspapersFilter } from '../value-objects/newspapers-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FetchNewspapersUseCase {
    private readonly newspapersRepository = inject(NewspapersRepository);

    execute(
        filter: NewspapersFilter,
        page: string
    ): Observable<Paginate<NewspapersEntity>> {
        console.log('FetchNewspapersUseCase', filter);
        return this.newspapersRepository.fetchNewspapers(filter, page);
    }
}
