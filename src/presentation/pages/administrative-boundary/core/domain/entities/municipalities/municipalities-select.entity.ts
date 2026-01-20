import { MunicipalitiesSelectItemApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/municipalities/municipalities-select-response-api.dto";

export class MunicipalitiesSelectEntity {
    constructor(
        public readonly name: string,
        public readonly code: string,
    ) { }

    public clone(updates: Partial<MunicipalitiesSelectEntity>): MunicipalitiesSelectEntity {
        return new MunicipalitiesSelectEntity(
            updates.name ?? this.name,
            updates.code ?? this.code,
        );
    }

    static fromDto(dto: MunicipalitiesSelectItemApiDto): MunicipalitiesSelectEntity {
        return new MunicipalitiesSelectEntity(
            dto.name,
            dto.code,
        );
    }

    public with(dto: MunicipalitiesSelectItemApiDto): MunicipalitiesSelectEntity {
        if (this.name === dto.name && this.code === dto.code) {
            return this;
        }
        return MunicipalitiesSelectEntity.fromDto(dto);
    }
}
