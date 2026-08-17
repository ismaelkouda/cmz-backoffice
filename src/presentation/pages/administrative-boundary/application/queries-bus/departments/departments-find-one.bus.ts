import { Injectable, inject } from '@angular/core';
import { DepartmentsFindOneQuery } from '@pages/administrative-boundary/application/queries/departments/departments-find-one.query';
import { DepartmentsFindOneHandler } from '@pages/administrative-boundary/application/queries-handlers/departments/departments-find-one.handler';
import { DepartmentsFindOneEntity } from '@pages/administrative-boundary/domain/entities/departments/departments-find-one.entity';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class DepartmentsFindOneBus {
    private readonly filterHandler = inject(DepartmentsFindOneHandler);

    dispatch<T>(
        query: T,
        options?: FetchOptions
    ): Observable<DepartmentsFindOneEntity> {
        if (query instanceof DepartmentsFindOneQuery) {
            return this.filterHandler.execute(query, options);
        }

        throw new Error('No handler found for query');
    }
}
