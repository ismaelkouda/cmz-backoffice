import { PrivacyPolicyCreateCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-create.command';

export function privacyPolicyCreateCommandMapper(
    command: PrivacyPolicyCreateCommand
) {
    return {
        version: command.version,
        content: command.content,
    };
}
