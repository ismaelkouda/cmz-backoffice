import { MunicipalitiesFindOneItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-find-one-response-api.dto';

export class MunicipalitiesFindOneEntity {
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
        public readonly updatedAt: string
    ) {}

    static fromDto(
        dto: MunicipalitiesFindOneItemApiDto
    ): MunicipalitiesFindOneEntity {
        return new MunicipalitiesFindOneEntity(
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

    public with(
        dto: MunicipalitiesFindOneItemApiDto
    ): MunicipalitiesFindOneEntity {
        if (this.updatedAt === dto.updated_at) {
            return this;
        }
        return MunicipalitiesFindOneEntity.fromDto(dto);
    }
}
