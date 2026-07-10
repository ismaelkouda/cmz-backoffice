import { InfrastructureSelectItemApiDto } from '@presentation/pages/administrative-infrastructure/infrastructure/api/dto/infrastructure/infrastructure-select-api.dto';

export class InfrastructureSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(
        dto: InfrastructureSelectItemApiDto
    ): InfrastructureSelectEntity {
        return new InfrastructureSelectEntity(dto.id, `${dto.name}`);
    }

    public with(
        dto: InfrastructureSelectItemApiDto
    ): InfrastructureSelectEntity {
        if (this.value === dto.id && this.label === `${dto.name}`) {
            return this;
        }
        return InfrastructureSelectEntity.fromDto(dto);
    }
}
