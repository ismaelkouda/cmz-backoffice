import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { RegionsSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/regions/regions-select.entity';
import { RegionsSelectRepository } from '@presentation/pages/administrative-boundary/domain/repositories/regions/regions-select-repository';

@Injectable({
    providedIn: 'root',
})
export class RegionsSelectUseCase {
    private readonly repository = inject(RegionsSelectRepository);

    execute(): Observable<RegionsSelectEntity[]> {
        return this.repository.execute();
    }
}
