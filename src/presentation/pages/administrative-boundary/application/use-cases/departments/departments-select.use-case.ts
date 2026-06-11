import { Injectable, inject } from '@angular/core';
import { DepartmentsSelectEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-select.entity';
import { DepartmentsSelectRepository } from '@pages/administrative-boundary/domain/repositories/departments/departments-select-repository';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsSelectUseCase {
    private readonly repository = inject(DepartmentsSelectRepository);

    execute(options?: FetchOptions): Observable<DepartmentsSelectEntity[]> {
        return this.repository.execute(options);
    }
}
