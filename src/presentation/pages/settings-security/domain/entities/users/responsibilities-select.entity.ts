import { ResponsibilitiesSelectItemApiDto } from '@pages/settings-security/infrastructure/api/dto/users/responsibilities-select-response-api.dto';

export class ResponsibilitiesSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(
        dto: ResponsibilitiesSelectItemApiDto
    ): ResponsibilitiesSelectEntity {
        return new ResponsibilitiesSelectEntity(dto.code, dto.name);
    }

    public with(
        dto: ResponsibilitiesSelectItemApiDto
    ): ResponsibilitiesSelectEntity {
        if (this.value === dto.code && this.label === dto.name) {
            return this;
        }
        return ResponsibilitiesSelectEntity.fromDto(dto);
    }
}
