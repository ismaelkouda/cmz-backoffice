import { PrivacyPolicyUpdateCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-update.command';

export function privacyPolicyUpdateCommandMapper(
    command: PrivacyPolicyUpdateCommand
) {
    return {
        uniqId: command.uniqId,
        version: command.version,
        content: command.content,
    };
}
