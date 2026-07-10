import { InfrastructureTypeSelectItemApiDto } from '@presentation/pages/administrative-infrastructure/infrastructure/api/dto/infrastructure-type/infrastructure-type-select-api.dto';

export class InfrastructureTypeSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(
        dto: InfrastructureTypeSelectItemApiDto
    ): InfrastructureTypeSelectEntity {
        return new InfrastructureTypeSelectEntity(dto.id, `${dto.name}`);
    }

    public with(
        dto: InfrastructureTypeSelectItemApiDto
    ): InfrastructureTypeSelectEntity {
        if (this.value === dto.id && this.label === `${dto.name}`) {
            return this;
        }
        return InfrastructureTypeSelectEntity.fromDto(dto);
    }
}
