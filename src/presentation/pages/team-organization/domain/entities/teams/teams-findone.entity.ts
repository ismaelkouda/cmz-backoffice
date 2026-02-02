import { TeamsFindOneItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-findone-response-api.dto';

export class TeamsFindOneEntity {
    constructor(
        public readonly id: string | undefined,
        public readonly code: string | undefined,
        public readonly name: string | undefined,
        public readonly description: string | undefined
    ) {}

    static fromDto(dto: TeamsFindOneItemApiDto): TeamsFindOneEntity {
        return new TeamsFindOneEntity(dto.id, dto.code, dto.name, dto.description);
    }

    public with(dto: TeamsFindOneItemApiDto): TeamsFindOneEntity {
        if (this.id === dto.id) {
            return this;
        }
        return TeamsFindOneEntity.fromDto(dto);
    }
}
