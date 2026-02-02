import { TeamsSelectItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-select-api.dto';

export class TeamsSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(dto: TeamsSelectItemApiDto): TeamsSelectEntity {
        return new TeamsSelectEntity(dto.code, dto.name);
    }

    public with(dto: TeamsSelectItemApiDto): TeamsSelectEntity {
        if (this.value === dto.code && this.label === dto.name) {
            return this;
        }
        return TeamsSelectEntity.fromDto(dto);
    }
}
