import { MunicipalitiesByDepartmentIdEntity } from "@presentation/pages/administrative-boundary/core/domain/entities/departments/municipalities-by-department-id.entity";
import { MunicipalitiesByDepartmentIdFilter } from "@presentation/pages/administrative-boundary/core/domain/value-objects/departments/municipalities-by-department-id-filter.vo";
import { Paginate } from "@shared/data/dtos/simple-response.dto";
import { Observable } from "rxjs";

export abstract class MunicipalitiesByDepartmentIdRepository {
    abstract readAll(
        filter: MunicipalitiesByDepartmentIdFilter | null,
        page: string
    ): Observable<Paginate<MunicipalitiesByDepartmentIdEntity>>;
}