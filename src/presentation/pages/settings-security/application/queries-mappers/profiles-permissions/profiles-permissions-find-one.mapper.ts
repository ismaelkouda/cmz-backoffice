import { ProfilesPermissionsFindOneQuery } from '@pages/settings-security/application/queries/profiles-permissions/profiles-permissions-find-one.query';

export function profilesPermissionsFindOneQueryMapper(
    command: ProfilesPermissionsFindOneQuery
) {
    return {
        uniqId: command.uniqId,
    };
}
