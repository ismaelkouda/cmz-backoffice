import { MunicipalitiesFindoneItemApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-findone-response-api.dto";

export class MunicipalitiesFindoneEntity {
    constructor(
        public readonly uniqId: string,
        public readonly name: string,
        public readonly code: string,
        public readonly description: string,
        public readonly region: string,
        public readonly department: string,
        public readonly populationSize: number,
        public readonly isActive: boolean,
        public readonly createdBy: string,
        public readonly updatedBy: string,
        public readonly createdAt: string,
        public readonly updatedAt: string,
    ) { }

    static fromDto(dto: MunicipalitiesFindoneItemApiDto): MunicipalitiesFindoneEntity {
        return new MunicipalitiesFindoneEntity(
            dto.id,
            dto.name,
            dto.code,
            dto.description,
            dto.region.code,
            dto.department.code,
            dto.population_size,
            dto.is_active,
            dto.created_by,
            dto.updated_by,
            dto.created_at,
            dto.updated_at
        );
    }

    public with(dto: MunicipalitiesFindoneItemApiDto): MunicipalitiesFindoneEntity {
        if (this.updatedAt === dto.updated_at) {
            return this;
        }
        return MunicipalitiesFindoneEntity.fromDto(dto);
    }
}
