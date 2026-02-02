import { ParticipantsUpdateVo } from '@presentation/pages/team-organization/domain/value-objects/participants/participants-update.vo';

export class ParticipantsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role: string
    ) {}
    static fromVo(vo: ParticipantsUpdateVo): ParticipantsUpdateEntity {
        return new ParticipantsUpdateEntity(
            vo.uniqId,
            vo.firstName,
            vo.lastName,
            vo.email,
            vo.phone,
            vo.role
        );
    }
}
