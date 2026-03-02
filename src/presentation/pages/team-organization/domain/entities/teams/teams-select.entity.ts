import { TeamsSelectItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/teams/teams-select-api.dto';

export class TeamsSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(dto: TeamsSelectItemApiDto): TeamsSelectEntity {
        return new TeamsSelectEntity(dto.uniq_id, dto.name);
    }

    public with(dto: TeamsSelectItemApiDto): TeamsSelectEntity {
        if (this.value === dto.uniq_id && this.label === dto.name) {
            return this;
        }
        return TeamsSelectEntity.fromDto(dto);
    }
}
