import { RegionsItemApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/regions/regions-response-api.dto";

export class RegionsEntity {
    constructor(
        public readonly uniqId: string,
        public name: string,
        public code: string,
        public description: string,
        public populationSize: number,
        public departmentsCount: number,
        public municipalitiesCount: number,
        public isActive: boolean,
        public createdBy: string,
        public updatedBy: string,
        public createdAt: string,
        public updatedAt: string
    ) { }

    static fromDto(dto: RegionsItemApiDto): RegionsEntity {
        return new RegionsEntity(
            dto.id,
            dto.name,
            dto.code,
            dto.description,
            dto.population_size,
            dto.departments_count,
            dto.municipalities_count,
            dto.is_active,
            dto.created_by,
            dto.updated_by,
            dto.created_at,
            dto.updated_at
        );
    }

    public with(dto: RegionsItemApiDto): RegionsEntity {
        if (this.updatedAt === dto.updated_at) {
            return this;
        }
        return RegionsEntity.fromDto(dto);
    }
}
