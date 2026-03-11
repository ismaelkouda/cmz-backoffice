import { Injectable, inject } from '@angular/core';
import { DepartmentsSelectEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-select.entity';
import { DepartmentsSelectRepository } from '@pages/administrative-boundary/domain/repositories/departments/departments-select-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsSelectUseCase {
    private readonly repository = inject(DepartmentsSelectRepository);

    execute(): Observable<DepartmentsSelectEntity[]> {
        return this.repository.execute();
    }
}
