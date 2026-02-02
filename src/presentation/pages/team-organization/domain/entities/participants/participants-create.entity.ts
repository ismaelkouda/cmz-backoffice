import { ParticipantsCreateVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-create.vo';

export class ParticipantsCreateEntity {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role: string
    ) {}

    static fromVo(vo: ParticipantsCreateVo): ParticipantsCreateEntity {
        return new ParticipantsCreateEntity(
            vo.firstName,
            vo.lastName,
            vo.email,
            vo.phone,
            vo.role
        );
    }
}
