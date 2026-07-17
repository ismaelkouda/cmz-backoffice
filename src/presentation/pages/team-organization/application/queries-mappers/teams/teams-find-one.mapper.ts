import { TeamsFindOneQuery } from '@pages/team-organization/application/queries/teams/teams-find-one.query';

export function teamsFindOneQueryMapper(command: TeamsFindOneQuery) {
    return {
        uniqId: command.uniqId,
    };
}
