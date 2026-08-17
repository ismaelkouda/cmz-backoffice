import { TeamsParticipantsQuery } from '@pages/team-organization/application/queries/teams/teams-participants.query';

export function teamsParticipantsQueryMapper(command: TeamsParticipantsQuery) {
    return {
        uniqId: command.uniqId,
        search: command.search,
    };
}
