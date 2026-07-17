import { ProfilesPermissionsEnableCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-enable.command';

export function profilesPermissionsEnableCommandMapper(
    command: ProfilesPermissionsEnableCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
