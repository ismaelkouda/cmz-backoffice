import { Roles } from '@shared/domain/enums/roles.enum';

export class ParticipantsUpdateCommand {
    constructor(
        public readonly uniqId: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role?: Roles,
        public readonly team?: string
    ) {}
}
