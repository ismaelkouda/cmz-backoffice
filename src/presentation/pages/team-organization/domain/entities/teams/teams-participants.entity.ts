import { TeamsParticipantsItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/teams/teams-participants-response-api.dto';

export class TeamsParticipantsEntity {
    constructor(
        public readonly uniqId: string,
        public matricule: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public role: string,
        public isActive: boolean
    ) {}

    static fromDto(dto: TeamsParticipantsItemApiDto): TeamsParticipantsEntity {
        return new TeamsParticipantsEntity(
            dto.uniq_id,
            dto.matricule,
            dto.first_name,
            dto.last_name,
            dto.email,
            dto.phone,
            dto.role,
            dto.is_active
        );
    }

    public with(dto: TeamsParticipantsItemApiDto): TeamsParticipantsEntity {
        if (this.uniqId === dto.uniq_id) {
            return this;
        }
        return TeamsParticipantsEntity.fromDto(dto);
    }
}
