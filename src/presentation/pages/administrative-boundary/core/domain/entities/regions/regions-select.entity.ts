import { DepartmentsSelectEntity } from "@presentation/pages/administrative-boundary/core/domain/entities/departments/departments-select.entity";
import { RegionsSelectItemApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-select-response-api.dto";
import { MapperUtils } from "@shared/utils/utils/mappers/mapper-utils";

export class RegionsSelectEntity {
    constructor(
        public readonly name: string,
        public readonly code: string,
        public readonly departments: readonly DepartmentsSelectEntity[]
    ) { }

    static fromDto(dto: RegionsSelectItemApiDto): RegionsSelectEntity {
        return new RegionsSelectEntity(
            dto.name,
            dto.code,
            dto.departments.map(DepartmentsSelectEntity.fromDto)
        );
    }

    public with(dto: RegionsSelectItemApiDto): RegionsSelectEntity {
        const departments = MapperUtils.mergeImmutable(
            this.departments,
            dto.departments,
            d => d.code,
            (entity, dto) => entity.with(dto),
            DepartmentsSelectEntity.fromDto
        );

        if (
            this.name === dto.name &&
            this.code === dto.code &&
            departments === this.departments
        ) {
            return this;
        }

        return new RegionsSelectEntity(dto.name, dto.code, departments);
    }
}
