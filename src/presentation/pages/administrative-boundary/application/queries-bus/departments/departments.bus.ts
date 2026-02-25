import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { DepartmentsQuery } from '@presentation/pages/administrative-boundary/application/queries/departments/departments.query';
import { DepartmentsHandler } from '@presentation/pages/administrative-boundary/application/queries-handlers/departments/departments.handler';
import { DepartmentsEntity } from '@presentation/pages/administrative-boundary/domain/entities/departments/departments.entity';

@Injectable({ providedIn: 'root' })
export class DepartmentsBus {
    constructor(private readonly filterHandler: DepartmentsHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<DepartmentsEntity>> {
        if (query instanceof DepartmentsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
