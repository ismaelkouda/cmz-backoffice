import { Roles } from '@shared/domain/enums/roles.enum';

export class ParticipantsCreateCommand {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly role?: Roles,
        public readonly team?: string
    ) {}
}
