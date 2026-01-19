import { Injectable, inject } from "@angular/core";
import { MunicipalitiesByDepartmentIdEntity } from "@presentation/pages/administrative-boundary/core/domain/entities/departments/municipalities-by-department-id.entity";
import { MunicipalitiesByDepartmentIdRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/departments/municipalities-by-department-id-repository";
import { MunicipalitiesByDepartmentIdFilter } from "@presentation/pages/administrative-boundary/core/domain/value-objects/departments/municipalities-by-department-id-filter.vo";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { Observable } from "rxjs";
import { MunicipalitiesByDepartmentIdFilterDto } from "../../dtos/departments/municipalities-by-department-id-filter.dto";

@Injectable({
    providedIn: 'root'
})

export class MunicipalitiesByDepartmentIdUseCase {
    private readonly repository = inject(MunicipalitiesByDepartmentIdRepository);

    readAll(
        filterDto: MunicipalitiesByDepartmentIdFilterDto | null,
        page: string
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>> {
        const filter = MunicipalitiesByDepartmentIdFilter.create(filterDto);
        return this.repository.readAll(filter, page);
    }
}
