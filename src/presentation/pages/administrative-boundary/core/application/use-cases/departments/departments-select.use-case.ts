import { Injectable, inject } from '@angular/core';
import { DepartmentsSelectEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments-select.entity';
import { DepartmentsSelectRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/departments/departments-select-repository';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsSelectUseCase {
    private readonly repository = inject(DepartmentsSelectRepository);

    readAll(): Observable<Array<DepartmentsSelectEntity>> {
        return this.repository.readAll();
    }
}
