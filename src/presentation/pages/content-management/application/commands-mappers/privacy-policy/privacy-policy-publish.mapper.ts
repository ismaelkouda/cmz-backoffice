import { PrivacyPolicyPublishCommand } from '@pages/content-management/application/commands/privacy-policy/privacy-policy-publish.command';

export function privacyPolicyPublishCommandMapper(
    command: PrivacyPolicyPublishCommand
) {
    return {
        uniqId: command.uniqId,
    };
}
