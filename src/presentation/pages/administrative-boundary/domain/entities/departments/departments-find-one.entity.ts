import { DepartmentsFindOneItemApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/departments/departments-find-one-response-api.dto';

export class DepartmentsFindOneEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly code: string,
        public readonly description: string,
        public readonly region: string,
        public readonly populationSize: number,
        public readonly municipalitiesCount: number,
        public readonly status: boolean,
        public readonly createdBy: string,
        public readonly updatedBy: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) {}

    static fromDto(
        dto: DepartmentsFindOneItemApiDto
    ): DepartmentsFindOneEntity {
        return new DepartmentsFindOneEntity(
            dto.id,
            dto.name,
            dto.code,
            dto.description,
            dto.region.id,
            dto.population_size,
            dto.municipalities_count,
            dto.is_active,
            dto.created_by,
            dto.updated_by,
            dto.created_at,
            dto.updated_at
        );
    }

    public with(dto: DepartmentsFindOneItemApiDto): DepartmentsFindOneEntity {
        if (this.updatedAt === dto.updated_at && this.uniqId === dto.id) {
            return this;
        }
        return DepartmentsFindOneEntity.fromDto(dto);
    }
}
