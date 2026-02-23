import { ParticipantsSelectItemApiDto } from '@presentation/pages/team-organization/infrastructure/api/dto/participants/participants-select-api.dto';

export class ParticipantsSelectEntity {
    constructor(
        public readonly value: string,
        public readonly label: string
    ) {}

    static fromDto(
        dto: ParticipantsSelectItemApiDto
    ): ParticipantsSelectEntity {
        return new ParticipantsSelectEntity(
            dto.id,
            `${dto.first_name} ${dto.last_name}`
        );
    }

    public with(dto: ParticipantsSelectItemApiDto): ParticipantsSelectEntity {
        if (
            this.value === dto.id &&
            this.label === `${dto.first_name} ${dto.last_name}`
        ) {
            return this;
        }
        return ParticipantsSelectEntity.fromDto(dto);
    }
}
