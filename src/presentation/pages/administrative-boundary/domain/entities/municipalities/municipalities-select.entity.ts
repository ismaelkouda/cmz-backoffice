import { MunicipalitiesSelectItemApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-select-response-api.dto';

export class MunicipalitiesSelectEntity {
    constructor(
        public readonly name: string,
        public readonly code: string
    ) {}

    static fromDto(
        dto: MunicipalitiesSelectItemApiDto
    ): MunicipalitiesSelectEntity {
        return new MunicipalitiesSelectEntity(dto.name, dto.id);
    }

    public with(
        dto: MunicipalitiesSelectItemApiDto
    ): MunicipalitiesSelectEntity {
        if (this.name === dto.name && this.code === dto.id) {
            return this;
        }
        return MunicipalitiesSelectEntity.fromDto(dto);
    }
}
