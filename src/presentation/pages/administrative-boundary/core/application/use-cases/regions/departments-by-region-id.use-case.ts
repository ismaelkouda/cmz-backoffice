import { Injectable, inject } from "@angular/core";
import { DepartmentsByRegionIdEntity } from "@presentation/pages/administrative-boundary/core/domain/entities/regions/departments-by-region-id.entity";
import { DepartmentsByRegionIdRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/regions/departments-by-region-id-repository";
import { DepartmentsByRegionIdFilter } from "@presentation/pages/administrative-boundary/core/domain/value-objects/regions/departments-by-region-id-filter.vo";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { Observable } from "rxjs";
import { DepartmentsByRegionIdFilterDto } from "../../dtos/regions/departments-by-region-id-filter.dto";

@Injectable({
    providedIn: 'root'
})

export class DepartmentsByRegionIdUseCase {
    private readonly repository = inject(DepartmentsByRegionIdRepository);

    readAll(
        filterDto: DepartmentsByRegionIdFilterDto | null,
        page: string
    ): Observable<Paginate<DepartmentsByRegionIdEntity>> {
        const filter = DepartmentsByRegionIdFilter.create(filterDto);
        return this.repository.readAll(filter, page);
    }
}
