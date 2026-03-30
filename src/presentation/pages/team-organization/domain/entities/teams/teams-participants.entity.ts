import { TeamsParticipantsItemApiDto } from '@pages/team-organization/infrastructure/api/dto/teams/teams-participants-response-api.dto';

export class TeamsParticipantsEntity {
    constructor(
        public readonly uniqId: string,
        public matricule: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public role: string,
        public isActive: boolean,
        public updatedAt?: string
    ) {}

    static fromDto(dto: TeamsParticipantsItemApiDto): TeamsParticipantsEntity {
        return new TeamsParticipantsEntity(
            dto.id,
            dto.matricule,
            dto.first_name,
            dto.last_name,
            dto.email,
            dto.phone,
            dto.role,
            dto.is_active,
            dto.updated_at
        );
    }

    public with(dto: TeamsParticipantsItemApiDto): TeamsParticipantsEntity {
        if (this.uniqId === dto.id && this.updatedAt === dto.updated_at) {
            return this;
        }
        return TeamsParticipantsEntity.fromDto(dto);
    }
}
