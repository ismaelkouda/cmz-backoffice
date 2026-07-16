import { ProfilesPermissionsDisableCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-disable.command';

export function profilesPermissionsDisableCommandMapper(
    command: ProfilesPermissionsDisableCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
