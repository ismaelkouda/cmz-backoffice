import { DepartmentsSelectItemApiDto } from "@presentation/pages/administrative-boundary/infrastructure/api/dtos/departments/departments-select-response-api.dto";
import { MapperUtils } from "@shared/utils/utils/mappers/mapper-utils";
import { MunicipalitiesSelectEntity } from "../municipalities/municipalities-select.entity";

export class DepartmentsSelectEntity {
    constructor(
        public readonly name: string,
        public readonly code: string,
        public readonly municipalities: readonly MunicipalitiesSelectEntity[],
    ) { }

    static fromDto(dto: DepartmentsSelectItemApiDto): DepartmentsSelectEntity {
        return new DepartmentsSelectEntity(
            dto.name,
            dto.code,
            dto.municipalities.map(MunicipalitiesSelectEntity.fromDto)
        );
    }

    public with(dto: DepartmentsSelectItemApiDto): DepartmentsSelectEntity {
        const municipalities = MapperUtils.mergeImmutable(
            this.municipalities,
            dto.municipalities,
            d => d.code,
            (entity, dto) => entity.with(dto),
            MunicipalitiesSelectEntity.fromDto
        );

        if (
            this.name === dto.name &&
            this.code === dto.code &&
            municipalities === this.municipalities
        ) {
            return this;
        }

        return new DepartmentsSelectEntity(dto.name, dto.code, municipalities);
    }
}
