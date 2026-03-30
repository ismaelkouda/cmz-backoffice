import { DepartmentsByRegionIdItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/regions/departments-by-region-id-response-api.dto';

export class DepartmentsByRegionIdEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly code: string,
        public readonly description: string,
        public readonly populationSize: number,
        public readonly municipalitiesCount: number,
        public readonly status: string,
        public readonly createdBy: string,
        public readonly updatedBy: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) {}

    static fromDto(
        dto: DepartmentsByRegionIdItemApiDto
    ): DepartmentsByRegionIdEntity {
        return new DepartmentsByRegionIdEntity(
            dto.id,
            dto.name,
            dto.code,
            dto.description,
            dto.population_size,
            dto.municipalities_count,
            dto.status,
            dto.created_by,
            dto.updated_by,
            dto.created_at,
            dto.updated_at
        );
    }

    public with(
        dto: DepartmentsByRegionIdItemApiDto
    ): DepartmentsByRegionIdEntity {
        if (this.updatedAt === dto.updated_at && this.uniqId === dto.id) {
            return this;
        }
        return DepartmentsByRegionIdEntity.fromDto(dto);
    }
}
