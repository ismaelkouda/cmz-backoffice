import { TeamsQuery } from '@pages/team-organization/application/queries/teams/teams.query';

export function teamsQueryMapper(command: TeamsQuery) {
    return {
        search: command.search,
        member: command.member,
        status: command.status,
    };
}
