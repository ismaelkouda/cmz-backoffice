import { Roles } from '@shared/domain/enums/roles.enum';

export class ParticipantsQuery {
    constructor(
        public readonly search?: string,
        public readonly role?: Roles,
        public readonly team?: string,
        public readonly status?: string
    ) {}
}
