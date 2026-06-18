import { ParticipantsUpdateVo } from '@pages/team-organization/domain/value-objects/participants/participants-update.vo';
import { Roles } from '@shared/domain/enums/roles.enum';

export class ParticipantsUpdateEntity {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role?: Roles,
        public readonly team?: string
    ) {}
    static fromVo(vo: ParticipantsUpdateVo): ParticipantsUpdateEntity {
        return new ParticipantsUpdateEntity(
            vo.uniqId,
            vo.firstName,
            vo.lastName,
            vo.email,
            vo.phone,
            vo.role,
            vo.team
        );
    }
}
