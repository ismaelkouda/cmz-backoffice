import { MunicipalitiesByDepartmentIdItemApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/municipalities-by-department-id-response-api.dto";

export class MunicipalitiesByDepartmentIdEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly code: string,
        public readonly description: string,
        public readonly region: string,
        public readonly populationSize: number,
        public readonly isActive: boolean,
        public readonly createdBy: string,
        public readonly updatedBy: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) { }

    static fromDto(dto: MunicipalitiesByDepartmentIdItemApiDto): MunicipalitiesByDepartmentIdEntity {
        return new MunicipalitiesByDepartmentIdEntity(
            dto.id,
            dto.name,
            dto.code,
            dto.description,
            dto.region.name,
            dto.population_size,
            dto.is_active,
            dto.created_by,
            dto.updated_by,
            dto.created_at,
            dto.updated_at
        );
    }

    public with(dto: MunicipalitiesByDepartmentIdItemApiDto): MunicipalitiesByDepartmentIdEntity {
        if (this.updatedAt === dto.updated_at) {
            return this;
        }
        return MunicipalitiesByDepartmentIdEntity.fromDto(dto);
    }
}
