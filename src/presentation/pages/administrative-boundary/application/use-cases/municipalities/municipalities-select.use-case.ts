import { Injectable, inject } from '@angular/core';
import { MunicipalitiesSelectEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-select.entity';
import { MunicipalitiesSelectRepository } from '@pages/administrative-boundary/domain/repositories/municipalities/municipalities-select-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MunicipalitiesSelectUseCase {
    private readonly repository = inject(MunicipalitiesSelectRepository);

    execute(): Observable<MunicipalitiesSelectEntity[]> {
        return this.repository.execute();
    }
}
