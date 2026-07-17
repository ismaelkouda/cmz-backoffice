import { ProfilesPermissionsQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions.query';

export function profilesPermissionsQueryMapper(
    command: ProfilesPermissionsQuery
) {
    return {
        search: command.search,
        user: command.user,
        status: command.status,
    };
}
