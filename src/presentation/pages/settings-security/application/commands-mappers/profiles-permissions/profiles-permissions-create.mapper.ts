import { ProfilesPermissionsCreateCommand } from '@pages/settings-security/application/commands/profiles-permissions/profiles-permissions-create.command';

export function profilesPermissionsCreateCommandMapper(
    command: ProfilesPermissionsCreateCommand
) {
    return {
        name: command.name,
        description: command.description,
        permissions: command.permissions,
    };
}
