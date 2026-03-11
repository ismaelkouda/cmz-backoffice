import { Injectable, inject } from '@angular/core';
import { RegionsSelectEntity } from '@pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { RegionsSelectRepository } from '@pages/administrative-boundary/domain/repositories/regions/regions-select-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RegionsSelectUseCase {
    private readonly repository = inject(RegionsSelectRepository);

    execute(): Observable<RegionsSelectEntity[]> {
        return this.repository.execute();
    }
}
