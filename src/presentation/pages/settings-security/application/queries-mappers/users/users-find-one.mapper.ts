import { UsersFindOneQuery } from '@pages/settings-security/application/queries/users/users-find-one.query';

export function usersFindOneQueryMapper(command: UsersFindOneQuery) {
    return {
        uniqId: command.uniqId,
    };
}
