import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DepartmentsFindOneQuery } from '@presentation/pages/administrative-boundary/application/queries/departments/departments-find-one.query';
import { DepartmentsFindOneUseCase } from '@presentation/pages/administrative-boundary/application/use-cases/departments/departments-find-one.use-case';
import { DepartmentsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';

@Injectable({ providedIn: 'root' })
export class DepartmentsFindOneHandler {
    private readonly useCase = inject(DepartmentsFindOneUseCase);

    execute(
        command: DepartmentsFindOneQuery
    ): Observable<DepartmentsFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
