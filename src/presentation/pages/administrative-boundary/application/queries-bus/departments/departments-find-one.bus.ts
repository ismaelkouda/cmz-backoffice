import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DepartmentsFindOneQuery } from '@presentation/pages/administrative-boundary/application/queries/departments/departments-find-one.query';
import { DepartmentsFindOneHandler } from '@presentation/pages/administrative-boundary/application/queries-handlers/departments/departments-find-one.handler';
import { DepartmentsFindOneEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';

@Injectable({ providedIn: 'root' })
export class DepartmentsFindOneBus {
    constructor(private readonly filterHandler: DepartmentsFindOneHandler) {}

    dispatch<T>(query: T): Observable<DepartmentsFindOneEntity> {
        if (query instanceof DepartmentsFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
