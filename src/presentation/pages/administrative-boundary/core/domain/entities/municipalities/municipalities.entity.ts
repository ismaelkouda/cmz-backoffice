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

    public clone(updates: Partial<MunicipalitiesEntity>): MunicipalitiesEntity {
        return new MunicipalitiesEntity(
            updates.uniqId ?? this.uniqId,
            updates.name ?? this.name,
            updates.code ?? this.code,
            updates.description ?? this.description,
            updates.region ?? this.region,
            updates.department ?? this.department,
            updates.populationSize ?? this.populationSize,
            updates.isActive ?? this.isActive,
            updates.createdBy ?? this.createdBy,
            updates.updatedBy ?? this.updatedBy,
            updates.createdAt ?? this.createdAt,
            updates.updatedAt ?? this.updatedAt
        );
    }

    public syncFromDto(dto: MunicipalitiesItemApiDto): void {
        this.name = dto.name;
        this.code = dto.code;
        this.description = dto.description;
        this.region = dto.region.name;
        this.department = dto.department.name;
        this.populationSize = dto.population_size;
        this.isActive = dto.is_active;
        this.updatedBy = dto.updated_by;
        this.updatedAt = dto.updated_at;
    }
}
