import { ProfilesPermissionsUsersQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions-users.query';

export function profilesPermissionsUsersQueryMapper(
    command: ProfilesPermissionsUsersQuery
) {
    return {
        uniqId: command.uniqId,
        search: command.search,
        userEmail: command.userEmail,
        phone: command.phone,
    };
}
