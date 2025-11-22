import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DetailsEntity } from '../entities/details/details.entity';
import { DetailsRepository } from '../repositories/details.repository';

@Injectable({
    providedIn: 'root',
})
export class FetchDetailsUseCase {
    private readonly detailsRepository = inject(DetailsRepository);

    execute(id: string, endPointType: EndPointType): Observable<DetailsEntity> {
        return this.detailsRepository.fetchDetails(id, endPointType);
    }
}
