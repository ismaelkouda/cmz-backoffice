import { Injectable, inject } from '@angular/core';
import { DepartmentsQuery } from '@pages/administrative-boundary/application/queries/departments/departments.query';
import { DepartmentsHandler } from '@pages/administrative-boundary/application/queries-handlers/departments/departments.handler';
import { DepartmentsEntity } from '@pages/administrative-boundary/domain/entities/departments/departments.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class DepartmentsBus {
    private readonly filterHandler = inject(DepartmentsHandler);

    dispatch<T>(
        query: T,
        page: string,
        options: FetchOptions = {}
    ): Observable<Paginate<DepartmentsEntity>> {
        if (query instanceof DepartmentsQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
