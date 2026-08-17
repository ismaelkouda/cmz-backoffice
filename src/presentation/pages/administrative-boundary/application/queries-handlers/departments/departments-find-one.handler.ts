import { departmentsFindOneQueryMapper } from '@pages/administrative-boundary/application/queries-mappers/departments/departments-find-one.mapper';
import { inject, Injectable } from '@angular/core';
import { DepartmentsFindOneQuery } from '@pages/administrative-boundary/application/queries/departments/departments-find-one.query';
import { DepartmentsFindOneUseCase } from '@pages/administrative-boundary/application/use-cases/departments/departments-find-one.use-case';
import { DepartmentsFindOneEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartmentsFindOneHandler {
    private readonly useCase = inject(DepartmentsFindOneUseCase);

    execute(
        command: DepartmentsFindOneQuery,
        options?: FetchOptions
    ): Observable<DepartmentsFindOneEntity> {
        return this.useCase.execute(
            departmentsFindOneQueryMapper(command),
            options
        );
    }
}
