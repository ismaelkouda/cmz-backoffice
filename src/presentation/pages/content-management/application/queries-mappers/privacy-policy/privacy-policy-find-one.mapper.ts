import { PrivacyPolicyFindOneQuery } from '@pages/content-management/application/queries/privacy-policy/privacy-policy-find-one.query';

export function privacyPolicyFindOneQueryMapper(
    command: PrivacyPolicyFindOneQuery
) {
    return {
        uniqId: command.uniqId,
    };
}
