import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { MunicipalitiesSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-select.entity';
import { MunicipalitiesSelectRepository } from '@presentation/pages/administrative-boundary/domain/repositories/municipalities/municipalities-select-repository';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesSelectUseCase {
    private readonly repository = inject(MunicipalitiesSelectRepository);

    execute(): Observable<MunicipalitiesSelectEntity[]> {
        return this.repository.execute();
    }
}
