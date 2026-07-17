import { PrivacyPolicyDeleteCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-delete.command';

export function privacyPolicyDeleteCommandMapper(
    command: PrivacyPolicyDeleteCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
