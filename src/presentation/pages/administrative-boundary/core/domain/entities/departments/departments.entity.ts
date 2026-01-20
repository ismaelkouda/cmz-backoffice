import { DepartmentsItemApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-response-api.dto";

export class DepartmentsEntity {
    constructor(
        public readonly uniqId: string,
        public name: string,
        public code: string,
        public description: string,
        public region: string,
        public populationSize: number,
        public municipalitiesCount: number,
        public isActive: boolean,
        public createdBy: string,
        public updatedBy: string,
        public createdAt: string,
        public updatedAt: string
    ) { }

    static fromDto(dto: DepartmentsItemApiDto): DepartmentsEntity {
        return new DepartmentsEntity(
            dto.id,
            dto.name,
            dto.code,
            dto.description,
            dto.region.name,
            dto.population_size,
            dto.municipalities_count,
            dto.is_active,
            dto.created_by,
            dto.updated_by,
            dto.created_at,
            dto.updated_at
        );
    }

    public with(dto: DepartmentsItemApiDto): DepartmentsEntity {
        if (this.updatedAt === dto.updated_at) {
            return this;
        }
        return DepartmentsEntity.fromDto(dto);
    }
}
