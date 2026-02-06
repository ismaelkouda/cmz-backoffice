import { RolesSelectItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/roles-select-api.dto';

export class RolesSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(dto: RolesSelectItemApiDto): RolesSelectEntity {
        return new RolesSelectEntity(dto.code, dto.name);
    }

    public with(dto: RolesSelectItemApiDto): RolesSelectEntity {
        if (this.value === dto.code && this.label === dto.name) {
            return this;
        }
        return RolesSelectEntity.fromDto(dto);
    }
}
