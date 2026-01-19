import { MunicipalitiesFindoneItemApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-findone-response-api.dto";

export class MunicipalitiesFindoneEntity {
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

    public clone(updates: Partial<MunicipalitiesFindoneEntity>): MunicipalitiesFindoneEntity {
        return new MunicipalitiesFindoneEntity(
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

    public syncFromDto(dto: MunicipalitiesFindoneItemApiDto): void {
        this.name = dto.name;
        this.code = dto.code;
        this.description = dto.description;
        this.region = dto.region.code;
        this.department = dto.department.code;
        this.populationSize = dto.population_size;
        this.isActive = dto.is_active;
        this.updatedBy = dto.updated_by;
        this.updatedAt = dto.updated_at;
    }
}
