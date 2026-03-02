import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { DepartmentsSelectEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-select.entity';
import { DepartmentsSelectRepository } from '@presentation/pages/administrative-boundary/domain/repositories/departments/departments-select-repository';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsSelectUseCase {
    private readonly repository = inject(DepartmentsSelectRepository);

    execute(): Observable<DepartmentsSelectEntity[]> {
        return this.repository.execute();
    }
}
