import { ParticipantsFindOneItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dtos/participants/participants-findone-response-api.dto';

export class ParticipantsFindOneEntity {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role: string
    ) {}

    static fromDto(
        dto: ParticipantsFindOneItemApiDto
    ): ParticipantsFindOneEntity {
        return new ParticipantsFindOneEntity(
            dto.id,
            dto.first_name,
            dto.last_name,
            dto.email,
            dto.phone,
            dto.role.name
        );
    }

    public with(dto: ParticipantsFindOneItemApiDto): ParticipantsFindOneEntity {
        if (this.uniqId === dto.id) {
            return this;
        }
        return ParticipantsFindOneEntity.fromDto(dto);
    }
}
