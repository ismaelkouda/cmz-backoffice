import { Injectable, inject } from '@angular/core';
import { DepartmentsFindoneEntity } from '@presentation/pages/administrative-boundary/core/domain/entities/departments/departments-findone.entity';
import { DepartmentsFindoneRepository } from '@presentation/pages/administrative-boundary/core/domain/repositories/departments/departments-findone-repository';
import { Observable } from 'rxjs';
import { DepartmentsFindoneFilter } from '../../../domain/value-objects/departments/departments-findone-filter.vo';
import { DepartmentsFindoneFilterDto } from '../../dtos/departments/departments-findone-filter.dto';

@Injectable({
    providedIn: 'root',
})
export class DepartmentsFindoneUseCase {
    private readonly repository = inject(DepartmentsFindoneRepository);

    read(
        filterDto: DepartmentsFindoneFilterDto,
    ): Observable<DepartmentsFindoneEntity> {
        const filter = DepartmentsFindoneFilter.create(filterDto);
        return this.repository.read(filter);
    }
}
