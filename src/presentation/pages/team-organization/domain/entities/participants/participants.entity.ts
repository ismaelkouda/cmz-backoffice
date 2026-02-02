import { ParticipantsItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-response-api.dto';

export class ParticipantsEntity {
    constructor(
        public readonly uniqId: string,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string,
        public role: string,
        public isActive: boolean,
        public createdAt: string
    ) {}

    static fromDto(dto: ParticipantsItemApiDto): ParticipantsEntity {
        return new ParticipantsEntity(
            dto.id,
            dto.first_name,
            dto.last_name,
            dto.email,
            dto.phone,
            dto.role,
            dto.is_active,
            dto.created_at
        );
    }

    public with(dto: ParticipantsItemApiDto): ParticipantsEntity {
        if (this.createdAt === dto.created_at) {
            return this;
        }
        return ParticipantsEntity.fromDto(dto);
    }
}
