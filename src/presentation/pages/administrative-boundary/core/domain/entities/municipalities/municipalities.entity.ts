import { MunicipalitiesItemApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-response-api.dto";

export class MunicipalitiesEntity {
    constructor(
        public readonly uniqId: string,
        public name: string,
        public code: string,
        public description: string,
        public region: string,
        public department: string,
        public populationSize: number,
        public isActive: boolean,
        public createdBy: string,
        public updatedBy: string,
        public createdAt: string,
        public updatedAt: string,
    ) { }

    static fromDto(dto: MunicipalitiesItemApiDto): MunicipalitiesEntity {
        return new MunicipalitiesEntity(
            dto.id,
            dto.name,
            dto.code,
            dto.description,
            dto.region.name,
            dto.department.name,
            dto.population_size,
            dto.is_active,
            dto.created_by,
            dto.updated_by,
            dto.created_at,
            dto.updated_at
        );
    }

    public with(dto: MunicipalitiesItemApiDto): MunicipalitiesEntity {
        if (this.updatedAt === dto.updated_at) {
            return this;
        }
        return MunicipalitiesEntity.fromDto(dto);
    }
}
