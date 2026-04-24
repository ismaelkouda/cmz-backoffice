import { Status } from '@pages/settings-security/domain/enums/profiles-permissions/profiles-permissions-status.enum';

export class ProfilesPermissionsQuery {
    constructor(
        public readonly search?: string,
        public readonly user?: string,
        public readonly status?: Status
    ) {}
}
