import { PrivacyPolicyUnpublishCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-unpublish.command';

export function privacyPolicyUnpublishCommandMapper(
    command: PrivacyPolicyUnpublishCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
